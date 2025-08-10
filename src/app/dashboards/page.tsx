// src/app/dashboards/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Dashboard Home</h1>
      <p>Welcome to the dashboard, {session?.user?.name}!</p>
      <p>Your roles: {session?.roles?.join(", ") || "No roles assigned"}</p>
    </div>
  );
}
