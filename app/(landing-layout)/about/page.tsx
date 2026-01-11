import FounderSection from "@/components/sections/about/founder-section";
import AboutHeroSection from "@/components/sections/about/hero-section";
import MissionSection from "@/components/sections/about/mission-section";
import OurStorySection from "@/components/sections/about/our-story-section";
import WhoWeServeSection from "@/components/sections/about/who-we-serve-section";
// import FAQSection from "@/components/sections/about/faq-section";

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <OurStorySection />
      <MissionSection />
      <FounderSection />
      <WhoWeServeSection />
      {/* <FAQSection /> */}
    </main>
  );
}
