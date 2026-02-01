import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library | Herlign FC Admin",
  description:
    "Upload and manage media files, images, and assets for the platform.",
};

export default function AdminMediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
