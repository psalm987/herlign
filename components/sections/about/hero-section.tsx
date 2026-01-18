import Image from "next/image";

const AboutHeroSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-perple-700 relative">
      <Image
        fill
        className="absolute inset-0 h-full w-auto object-cover md:object-fill 2xl:object-contain "
        src="/images/png/perple-bound-left.png"
        alt=""
        priority
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="font-heading text-3xl sm:text-5xl  md:text-7xl font-semibold text-white mb-4 text-center max-w-xl mx-auto">
          Inside Every Hero is a{" "}
          <span className="font-handwriting text-ohrange-500 text-4xl sm:text-6xl md:text-8xl">
            Her
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-center text-pretty text-white/90 mb-4 leading-snug">
          We&apos;re not Liverpool, but we promise, you&apos;ll never walk
          alone.
        </p>
      </div>
    </section>
  );
};

export default AboutHeroSection;
