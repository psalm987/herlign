import Logo from "@/components/svg/logo";
import Image from "next/image";

const StartAnywayHeroSection = () => {
  return (
    <section className="bg-peenk-500 relative overflow-hidden group ">
      <Image
        src="/images/png/patterns/ohrange-500-mini.png"
        alt=""
        fill
        className="absolute h-auto w-screen object-cover scale-200 group-hover:blur-2xl transition-all duration-700 "
        priority
      />
      <span className=" inset-0 bg-ohrange-800 h-full w-full absolute opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      <div className="py-20 md:py-28 px-8 relative flex flex-col max-w-4xl mx-auto text-white text-center md:text-left">
        <Logo
          animate
          size={150}
          className="fill-white self-end mb-12 hidden md:inline"
        />
        <h2 className="font-heading text-3xl sm:text-5xl  md:text-7xl font-semibold mb-4 ">
          There&apos;s No Such Thing As Perfect Timing
        </h2>
        <p className="md:max-w-2xl text-lg md:text-xl leading-relaxed">
          Stop waiting for “perfect.” Take the step you&apos;ve been hesitating
          on. This is your toolkit to start the step you&apos;ve been hesitating
          on.
        </p>
      </div>
    </section>
  );
};

export default StartAnywayHeroSection;
