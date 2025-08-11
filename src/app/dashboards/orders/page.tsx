import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Orders() {
  const session = await getServerSession(authOptions);

  // Check if user has admin role
  const isAdmin = session?.roles?.includes("admin");

  //   if (!isAdmin) {
  //     return (
  //       <div>
  //         <h1>Access Denied</h1>
  //         <p>You don't have permission to access this page.</p>
  //         <p>Required role: admin</p>
  //       </div>
  //     );
  //   }

  return (
    <div>
      <h1>Order Management</h1>
      <p>Welcome to the customer section, {session?.user?.name}!</p>
      <p>This page is accessible to both admin and user roles.</p>
    </div>
  );
}
