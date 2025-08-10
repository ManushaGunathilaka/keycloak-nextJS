// src/app/dashboards/advertisement/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Advertisement() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Advertisement</h1>
      <p>Welcome to the advertisement section, {session?.user?.name}!</p>
      <p>This page is accessible to both admin and user roles.</p>
      <p>Manage your advertisements here...</p>
    </div>
  );
}
