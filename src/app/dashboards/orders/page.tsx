import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Orders() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Order Management</h1>
      <p>Welcome to the customer section, {session?.user?.name}!</p>
      <p>This page is accessible to both admin and user roles.</p>
    </div>
  );
}
