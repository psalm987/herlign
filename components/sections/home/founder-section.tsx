import Link from "next/link";
import { Button } from "@/components/ui/button";
import HerlignPattern from "@/components/svg/herlign-pattern";

export function FounderSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-12 text-center">
          From Our Founder
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              <div className="w-48 h-48 rounded-full bg-perple-200 overflow-hidden relative">
                {/* <div className="w-full h-full flex items-center justify-center text-perple-600 font-heading text-6xl">
                  H
                </div> */}
                <HerlignPattern size="600" className="absolute" />
              </div>
            </div>

            <div className="flex-1">
              <p className="font-sans text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                &quot;Herlign was created because I wanted every creative woman
                to thrive. You deserve a place to grow without fear, and to
                build without waiting for perfect.&quot;
              </p>

              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn more about Herlign</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
