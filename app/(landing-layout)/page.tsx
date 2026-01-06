import HeroSection from "@/components/sections/home/hero-section";
import YoutubeSection from "@/components/sections/home/youtube-section";
import HypeSquadSection from "@/components/sections/home/hype-squad-section";
import StartAnywaySection from "@/components/sections/home/start-anyway-section";
import QuizSection from "@/components/sections/home/quiz-section";
import TestimonialsSection from "@/components/sections/home/testimonials-section";
import FounderSection from "@/components/sections/home/founder-section";

export default function Home() {
  return (
    <main>
      <div className="bg-linear-to-b from-peenk-500 via-peenk-400 to-peenk-100">
        <HeroSection />
      </div>
      <YoutubeSection />
      <HypeSquadSection />
      <StartAnywaySection />
      <QuizSection />
      <TestimonialsSection />
      <FounderSection />
    </main>
  );
}
