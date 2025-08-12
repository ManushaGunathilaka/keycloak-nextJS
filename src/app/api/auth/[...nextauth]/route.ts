import { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak";

function requestRefreshOfAccessToken(token: JWT) {
  return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken!,
    }),
    cache: "no-store",
  });
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: "", // Empty string for public clients
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
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
      if (Date.now() < token.expiresAt! * 1000 - 60 * 1000) {
        return token;
      }
      try {
        const response = await requestRefreshOfAccessToken(token);
        const tokens: TokenSet = await response.json();
        if (!response.ok) throw tokens;
        const updatedToken: JWT = {
          ...token,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(
            Date.now() / 1000 + (tokens.expires_in as number)
          ),
          refreshToken: tokens.refresh_token ?? token.refreshToken,
        };
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
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.roles = token.roles;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
