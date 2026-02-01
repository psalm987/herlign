import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Herlign FC",
  description: "Authenticating your Herlign FC admin session.",
};

export default function CallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
