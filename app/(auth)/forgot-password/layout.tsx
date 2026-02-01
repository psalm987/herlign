import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Herlign FC",
  description:
    "Reset your Herlign FC admin password. Enter your email to receive password reset instructions.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
