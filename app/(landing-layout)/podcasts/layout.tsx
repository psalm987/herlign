import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcasts | Herlign FC - Career Insights & Inspiration",
  description:
    "Watch inspiring podcast episodes featuring career advice, success stories, and professional development tips for women. Learn from experts and community leaders.",
};

export default function PodcastsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
