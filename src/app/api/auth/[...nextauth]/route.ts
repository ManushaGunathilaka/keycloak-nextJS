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

// Helper function to extract roles from JWT payload
function extractRolesFromToken(accessToken: string) {
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const realmRoles = payload.realm_access?.roles || [];
    const resourceRoles: string[] = [];
    if (payload.resource_access) {
      Object.keys(payload.resource_access).forEach((resource) => {
        const roles = payload.resource_access[resource]?.roles || [];
        resourceRoles.push(...roles);
      });
    }
    const allRoles = [...realmRoles, ...resourceRoles];
    return {
      realmRoles,
      resourceRoles,
      allRoles,
    };
  } catch (error) {
    console.error("Error parsing access token:", error);
    return {
      realmRoles: [],
      resourceRoles: [],
      allRoles: [],
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: "",
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
          const { realmRoles, resourceRoles, allRoles } = extractRolesFromToken(
            account.access_token
          );
          token.realmRoles = realmRoles;
          token.resourceRoles = resourceRoles;
          token.roles = allRoles;
        }
        return token;
      }

      if (Date.now() < token.expiresAt! * 1000 - 60 * 1000) {
        console.log("Access Token: ", token.accessToken);
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
          const { realmRoles, resourceRoles, allRoles } = extractRolesFromToken(
            tokens.access_token
          );
          updatedToken.realmRoles = realmRoles;
          updatedToken.resourceRoles = resourceRoles;
          updatedToken.roles = allRoles;
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
      session.realmRoles = token.realmRoles;
      session.resourceRoles = token.resourceRoles;
      console.log("Session roles:", {
        allRoles: session.roles,
        realmRoles: session.realmRoles,
        resourceRoles: session.resourceRoles,
      });
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
