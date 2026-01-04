import { FounderSection } from "@/components/sections/about/founder-section";
import TestimonialsSection from "@/components/sections/about/testimonial-section";
import AboutHeroSection from "@/components/sections/about/hero-section";
import FAQSection from "@/components/sections/about/faq-section";

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <FounderSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  );
}
