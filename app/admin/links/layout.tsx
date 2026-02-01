import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Links | Herlign FC Admin",
  description: "Manage external links and resources for the community.",
};

export default function AdminLinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
