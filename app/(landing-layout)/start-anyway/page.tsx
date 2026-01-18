import StartAnywayHeroSection from "@/components/sections/start-anyway/hero-section";
import WhoThisIsForSection from "@/components/sections/start-anyway/who-this-is-for-section";
import HowItWorksSection from "@/components/sections/start-anyway/how-it-works-section";
import CTASection from "@/components/sections/start-anyway/cta-section";

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
