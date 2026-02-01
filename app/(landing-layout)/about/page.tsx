import type { Metadata } from "next";
import FounderSection from "@/components/sections/about/founder-section-2";
import AboutHeroSection from "@/components/sections/about/hero-section";
import MissionSection from "@/components/sections/about/mission-section";
import OurStorySection from "@/components/sections/about/our-story-section";
import ValuesSection from "@/components/sections/about/values-section";
import WhatWeDoSection from "@/components/sections/about/what-we-do-section";
import WhoWeServeSection from "@/components/sections/about/who-we-serve-section";
// import FAQSection from "@/components/sections/about/faq-section";

export const metadata: Metadata = {
  title: "About Us | Herlign FC - Our Story, Mission & Values",
  description:
    "Learn about Herlign Female Creatives' mission to empower women in their careers. Discover our story, core values, and commitment to supporting ambitious women professionals.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <OurStorySection />
      <MissionSection />
      <FounderSection />
      <WhoWeServeSection />
      <ValuesSection />
      <WhatWeDoSection />
      {/* <FAQSection /> */}
    </main>
  );
}
