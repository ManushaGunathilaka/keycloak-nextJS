// src/app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect directly to NextAuth signin which will show Keycloak login
    redirect("/api/auth/signin");
  }

  // If user is authenticated, redirect to dashboard
  redirect("/dashboards");
}
