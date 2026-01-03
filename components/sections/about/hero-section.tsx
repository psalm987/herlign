import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutHeroSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-5xl  md:text-7xl font-semibold text-gray-900 mb-4 text-center">
          <span className="text-peenk-300">Forget Fitting In.</span>
          <br />
          We&apos;re Here to{" "}
          <span className="font-handwriting text-ohrange-500 text-4xl sm:text-6xl md:text-8xl">
            Build Out!
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-center text-pretty text-gray-700 mb-4 leading-snug">
          Herling was born from a simple, rebellious idea: that{" "}
          <strong>your voice matters now,</strong>{" "}
          <em>not after 10,000 hours</em> of silent practice.
          <br /> <br /> We&apos;re a digital sanctuary for the woman with an
          idea scribbled on a napkin, a half-finished draft, or a dream
          she&apos;s too scared to name. We provide the tools, the tribe, and
          the tough love to help you
        </p>
        <div className="flex justify-center mt-8">
          <Button asChild size="xl" className="bg-ohrange-500 ">
            <Link href="/start-anyway">Start anyway</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
