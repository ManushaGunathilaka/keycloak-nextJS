// src/app/api/auth/[...nextauth]/route.ts

// Types from NextAuth
import { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";

// Keycloak OAuth 2.0 / OIDC provider for NextAuth
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Helper function to refresh an expired access token using the refresh token.
 * This calls the Keycloak `/token` endpoint with `grant_type=refresh_token`.
 *
 * @param token - Current JWT token object stored in NextAuth
 * @returns Fetch API response containing new token data
 */
function requestRefreshOfAccessToken(token: JWT) {
  return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!, //!!! “Trust me — this value is not null or undefined at runtime.”
      grant_type: "refresh_token",
      refresh_token: token.refreshToken!, // Using existing refresh token
    }),
    cache: "no-store", // Avoid caching token responses
  });
}

// NextAuth configuration
export const authOptions: AuthOptions = {
  providers: [
    /**
     * Keycloak Provider
     * - Handles PKCE Authorization Code Flow internally
     * - Redirects the user to Keycloak login
     * - Exchanges authorization code for tokens
     */
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],

  // Session stored as JWT instead of in a database
  session: {
    strategy: "jwt",
    maxAge: 60 * 30, // Session expiration in seconds (30 minutes)
  },

  callbacks: {
    /**
     * JWT Callback:
     * - Called whenever a JWT is created/updated
     * - Runs on initial sign-in and on each request
     */
    async jwt({ token, account }) {
      // --- Step 1: Initial sign-in ---
      if (account) {
        // Store tokens from Keycloak into NextAuth's JWT
        token.idToken = account.id_token; // Identity token (user claims)
        token.accessToken = account.access_token; // Access token for API calls
        token.refreshToken = account.refresh_token; // Used for refreshing access token
        token.expiresAt = account.expires_at; // Expiration time (epoch seconds)

        // Decode access token to extract user roles from Keycloak
        if (account.access_token) {
          try {
            const payload = JSON.parse(
              atob(account.access_token.split(".")[1])
            );
            token.roles = payload.realm_access?.roles || [];
          } catch (error) {
            console.error("Error parsing access token:", error);
            token.roles = [];
          }
        }

        return token;
      }

      // --- Step 2: Subsequent requests ---
      // If token is still valid (with 1-minute buffer), return it
      if (Date.now() < token.expiresAt! * 1000 - 60 * 1000) {
        return token;
      }

      // --- Step 3: Refresh expired access token ---
      try {
        const response = await requestRefreshOfAccessToken(token);
        const tokens: TokenSet = await response.json();

        if (!response.ok) throw tokens; // Refresh failed

        // Build updated token object
        const updatedToken: JWT = {
          ...token,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(
            Date.now() / 1000 + (tokens.expires_in as number)
          ),
          refreshToken: tokens.refresh_token ?? token.refreshToken, // Keep old if not returned
        };

        // Decode new access token for updated roles
        if (tokens.access_token) {
          try {
            const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
            updatedToken.roles = payload.realm_access?.roles || [];
          } catch (error) {
            console.error("Error parsing refreshed access token:", error);
          }
        }

        return updatedToken;
      } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    /**
     * Session Callback:
     * - Runs when `getSession()` or `useSession()` is called
     * - Passes token values into the session object accessible in the frontend
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Provide access token to frontend
      session.error = token.error; // Provide any token refresh errors
      session.roles = token.roles; // Provide roles for role-based UI logic
      return session;
    },
  },
};

// Export GET and POST handlers for NextAuth API route
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
