import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Herlign FC Admin",
  description:
    "Admin dashboard for managing Herlign Female Creatives platform. View analytics and quick access to content management.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
