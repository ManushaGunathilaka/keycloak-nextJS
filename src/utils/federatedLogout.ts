import { signOut } from "next-auth/react";

export default async function federatedLogout() {
  try {
    const response = await fetch("/api/auth/federated-logout");
    const data = await response.json();
    if (response.ok) {
      // Sign out and redirect to the root page, clearing any callback URL
      await signOut({
        redirect: false,
        callbackUrl: "/", // This ensures the callback URL is set to root
      });
      window.location.href = data.url;
      return;
    }
    throw new Error(data.error);
  } catch (error) {
    console.log(error);
    alert(error);
    // Also clear callback URL in error case
    await signOut({
      redirect: false,
      callbackUrl: "/",
    });
    window.location.href = "/api/auth/signin";
  }
}
