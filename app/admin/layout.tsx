import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { AdminLayout } from "@/components/admin/admin-layout";

export default async function Layout({ children }: { children: ReactNode }) {

  // Server-side auth check
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
