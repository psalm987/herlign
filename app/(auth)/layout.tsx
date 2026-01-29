import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Server-side auth check
  const user = await getAuthUser();

  if (user) {
    redirect("/admin");
  }
  return <>{children}</>;
}
