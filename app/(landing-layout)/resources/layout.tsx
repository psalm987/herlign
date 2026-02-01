import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Herlign FC - Career Guides, eBooks & Templates",
  description:
    "Access free and premium career resources including eBooks, guides, and templates. Everything you need to advance your professional journey as a woman in your field.",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
