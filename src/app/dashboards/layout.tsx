import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex h-screen">
      <Sidebar roles={session.roles || []} />
      <div className="flex flex-col flex-1">
        <Header user={session.user} />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
