import type { Metadata } from "next";
import HeroSection from "@/components/sections/home/hero-section";
import YoutubeSection from "@/components/sections/home/youtube-section";
import HypeSquadSection from "@/components/sections/home/hype-squad-section";
import StartAnywaySection from "@/components/sections/home/start-anyway-section";
import QuizSection from "@/components/sections/home/quiz-section";
import TestimonialsSection from "@/components/sections/home/testimonials-section";
import FounderSection from "@/components/sections/home/founder-section";

export const metadata: Metadata = {
  title: "Home | Herlign FC - Empowering Women in Their Career Journey",
  description:
    "Join Herlign Female Creatives, a supportive community empowering women to thrive in their careers. Access resources, events, workshops, and career coaching designed for ambitious women.",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <YoutubeSection />
      <HypeSquadSection />
      <StartAnywaySection />
      <QuizSection />
      <TestimonialsSection />
      <FounderSection />
    </main>
  );
}
