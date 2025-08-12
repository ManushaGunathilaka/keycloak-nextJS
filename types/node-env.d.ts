declare namespace NodeJS {
  export interface ProcessEnv {
    KEYCLOAK_CLIENT_ID: string;
    KEYCLOAK_ISSUER: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
  }
}
