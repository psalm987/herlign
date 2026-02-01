import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Events | Herlign FC Admin",
  description:
    "Create and manage events and workshops for the Herlign community.",
};

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
