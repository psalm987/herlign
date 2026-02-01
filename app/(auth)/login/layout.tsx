import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Herlign FC",
  description:
    "Admin access portal for Herlign Female Creatives. Manage events, resources, podcasts, and community content.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
