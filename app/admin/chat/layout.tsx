import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Sessions | Herlign FC Admin",
  description:
    "Manage and respond to chat conversations with community members.",
};

export default function AdminChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
