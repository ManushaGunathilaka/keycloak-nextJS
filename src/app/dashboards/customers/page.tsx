import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Customers() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Customers Management</h1>
      <p>Welcome to the customer section, {session?.user?.name}!</p>
      <p>This page is accessible to both admin and user roles.</p>
    </div>
  );
}
