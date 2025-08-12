import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const isAdmin = session?.roles?.includes("admin");

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
      <h1>Dashboard Home</h1>
      <p>Welcome {session?.user?.name}!</p>
      <p>This page is accessible to both admin and user roles.</p>
    </div>
  );
}
