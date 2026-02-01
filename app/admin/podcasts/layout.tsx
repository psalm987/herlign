import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Podcasts | Herlign FC Admin",
  description: "Manage podcast episodes and YouTube content visibility.",
};

export default function AdminPodcastsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
