import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Testimonials | Herlign FC Admin",
  description:
    "Review, approve, and manage community testimonials and reviews.",
};

export default function AdminTestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
