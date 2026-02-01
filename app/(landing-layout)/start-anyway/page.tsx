import type { Metadata } from "next";
import StartAnywayHeroSection from "@/components/sections/start-anyway/hero-section";
import WhoThisIsForSection from "@/components/sections/start-anyway/who-this-is-for-section";
import HowItWorksSection from "@/components/sections/start-anyway/how-it-works-section";
import CTASection from "@/components/sections/start-anyway/cta-section";

export const metadata: Metadata = {
  title: "Start Anyway | Herlign FC - Begin Your Journey Today",
  description:
    "Take the first step in your career transformation. Start Anyway is our initiative to help women overcome barriers and begin their professional journey with confidence and support.",
};

export default function StartAnywayPage() {
  return (
    <main>
      <StartAnywayHeroSection />
      <WhoThisIsForSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
