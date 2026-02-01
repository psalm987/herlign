import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Herlign FC",
  description: "Create a new password for your Herlign FC admin account.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
