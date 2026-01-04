import LINKS from "@/components/constants/links";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const AboutHeroSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-perple-700 relative">
      <Image
        fill
        className="absolute inset-0 h-full w-auto"
        src="/images/png/perple-bound-left.png"
        alt=""
        priority
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="font-heading text-3xl sm:text-5xl  md:text-7xl font-semibold text-white mb-4 text-center">
          <span className="text-perple-300">Forget Fitting In.</span>
          <br />
          We&apos;re Here to{" "}
          <span className="font-handwriting text-ohrange-500 text-4xl sm:text-6xl md:text-8xl">
            Build Out !
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-center text-pretty text-white/90 mb-4 leading-snug">
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
            <Link href={LINKS[0].start_anyway}>Start anyway</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
