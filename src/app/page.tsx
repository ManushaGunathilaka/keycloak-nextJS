import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session.roles?.includes("admin")) {
    redirect("/dashboards");
  } else {
    redirect("/dashboards/advertisement");
  }
}
