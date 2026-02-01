import Link from "next/link";
import { Button } from "@/components/ui/button";
import LINKS from "@/components/constants/links";
import Image from "next/image";
import AnimateCreative from "./animate-creative";

export default function HeroSection() {
  return (
    <section className="relative pt-25 md:pt-20 pb-0 bg-linear-to-b bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-30 md:mb-0">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-6 text-pretty">
            A Home for{" "}
            {/* <span className="font-handwriting text-ohrange-600 text-5xl sm:text-6xl md:text-7xl lg:text-9xl">
              Creative
            </span> */}
            {/* 
            170x55
            255x85
            455x150
            */}
            <AnimateCreative /> Women
          </h1>

          <p className="font-sans text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Every creative woman needs a tribe, and you&apos;ve just found
            yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="2xl" className="bg-ohrange-500">
              <Link
                href={LINKS.external.join_whatsapp_community}
                target="_blank"
              >
                Join the community
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Image
        src="/images/webp/hero-image-super-enhanced.webp"
        alt=""
        width={1500}
        height={600}
        className="relative mx-auto mt-10 md:mt-0 lg:translate-y-25"
        priority
      />
      {/* <span className="absolute -bottom-0.5 left-0 w-full bg-linear-to-b from-transparent to-white h-10 md:h-25" /> */}
    </section>
  );
}
