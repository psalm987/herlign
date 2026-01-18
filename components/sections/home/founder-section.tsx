import LINKS from "@/components/constants/links";
// import HerlignPattern from "@/components/svg/herlign-pattern";
import Image from "next/image";
import Link from "next/link";

export default function FounderSection() {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-ohrange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="shrink-0">
              <div className="size-48 rounded-full bg-perple-200 overflow-hidden relative">
                {/* <div className="w-full h-full flex items-center justify-center text-perple-600 font-heading text-6xl">
                  H
                </div> */}
                {/* <HerlignPattern size="300" className="absolute" /> */}
                <Image
                  src="/images/jpeg/maureen2.jpeg"
                  alt="Maureen Dede"
                  fill
                  className="object-cover origin-top-left scale-120 sepia-10"
                />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                From Our{" "}
                <span className="font-handwriting text-ohrange-500 text-4xl sm:text-5xl md:text-6xl">
                  Founder
                </span>
              </h2>
              <p className="font-sans text-lg md:text-xl text-gray-700 mb-4 leading-relaxed italic">
                Herlign FC was created because I wanted every creative woman to
                thrive. You deserve a place to grow without fear, and to build
                without waiting for perfect.
              </p>
              <Link
                className="text-perple-500 hover:underline font-semibold"
                href={LINKS.about}
              >
                See more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
