import { Navigation } from "@/components/sections/general/navigation";
import { HeroSection } from "@/components/sections/home/hero-section";
import { SafeSpaceSection } from "@/components/sections/home/safe-space-section";
import { CommunityFeaturesSection } from "@/components/sections/home/community-features-section";
import { StartAnywaySection } from "@/components/sections/home/start-anyway-section";
import { QuizSection } from "@/components/sections/home/quiz-section";
import { TestimonialsSection } from "@/components/sections/home/testimonials-section";
// import { FounderSection } from "@/components/sections/home/founder-section";
// import { FinalCtaSection } from "@/components/sections/home/final-cta-section";
import { Footer } from "@/components/sections/general/footer";
import CurvedLineSection from "@/components/sections/home/curved-line-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <div className="bg-linear-to-b from-peenk-500 via-peenk-400 to-peenk-100">
          <HeroSection />
          <CurvedLineSection />
        </div>
        <SafeSpaceSection />
        <CommunityFeaturesSection />
        <StartAnywaySection />
        <QuizSection />
        <TestimonialsSection />
        {/* <FounderSection /> */}
        {/* <FinalCtaSection /> */}
      </main>
      <Footer />
    </div>
  );
}
