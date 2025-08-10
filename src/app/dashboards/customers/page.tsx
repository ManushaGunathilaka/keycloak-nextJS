// src/app/dashboards/customers/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Customers() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Check if user has admin role
  const isAdmin = session.roles?.includes("admin");

  if (!isAdmin) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Required role: admin</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Customers Management</h1>
      <p>This page is only accessible to administrators.</p>
      <p>Here you can manage customer data...</p>
    </div>
  );
}
