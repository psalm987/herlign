import Logo from "@/components/svg/logo";
import Image from "next/image";

const StartAnywayHeroSection = () => {
  return (
    <section className="bg-peenk-500 relative overflow-hidden">
      <Image
        src="/images/png/patterns/ohrange-500-mini.png"
        alt=""
        fill
        className="absolute h-auto w-screen object-cover"
        priority
      />
      <div className="py-20 md:py-28 px-8 relative flex flex-col max-w-4xl mx-auto text-white text-center md:text-left">
        <Logo
          size={150}
          className="fill-white self-end mb-12 hidden md:inline"
        />
        <h2 className="font-heading text-3xl sm:text-5xl  md:text-7xl font-semibold mb-4 ">
          Your Anti-Perfectionism Toolkit.
        </h2>
        <p className="md:max-w-md text-lg">
          Stop planning. Start doing. Everything you need to silence your inner
          critic and launch that thing.
        </p>
      </div>
    </section>
  );
};

export default StartAnywayHeroSection;
