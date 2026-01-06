import Link from "next/link";
import { Button } from "@/components/ui/button";
import LINKS from "@/components/constants/links";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative pt-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-6 text-pretty">
            A Home for{" "}
            <span className="font-handwriting text-ohrange-600 text-5xl sm:text-6xl md:text-7xl lg:text-9xl">
              Creative
            </span>{" "}
            Women
          </h1>

          <p className="font-sans text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Every creative woman needs a tribe, and you&apos;ve just found
            yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="xl" className="bg-ohrange-500">
              <Link
                href={LINKS.external.join_whatsapp_community}
                target="_blank"
              >
                Join the community
              </Link>
            </Button>
            <Button asChild size="xl">
              <Link href={LINKS.start_anyway}>
                Join the &apos;Start Anyway&apos; movement
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Image
        src="/images/png/home-hero(1200x800).png"
        alt=""
        width={1200}
        height={800}
        className="mx-auto mt-16 md:mt-24"
        priority
      />
    </section>
  );
}
