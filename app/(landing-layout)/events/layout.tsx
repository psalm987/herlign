import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Workshops | Herlign FC - Career Development Programs",
  description:
    "Discover upcoming career workshops and events for women. Join live and online sessions focused on professional development, skill building, and career advancement.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
