import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Resources | Herlign FC Admin",
  description:
    "Create and manage career resources, guides, and downloadable content.",
};

export default function AdminResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
