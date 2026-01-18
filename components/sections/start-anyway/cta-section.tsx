"use client";
import { useRef } from "react";
import { useViewport } from "@/lib/hook/useViewport";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import LINKS from "@/components/constants/links";

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isInViewport } = useViewport(ref, {
    threshold: 0.8,
    direction: "both",
  });

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4" ref={ref}>
        <div
          className={cn(
            "relative rounded-3xl bg-linear-to-br from-ohrange-500 via-80% to-ohrange-700 p-8 py-12 md:p-12 lg:p-16",
            "transition-transform duration-700",
            isInViewport && "scale-100",
            !isInViewport && "scale-95",
          )}
        >
          {/* Pulsing badge */}
          <span className="absolute -top-2 -right-2 lg:-top-6 lg:-right-6 ">
            <span className="relative flex size-8 lg:size-16">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-peenk-400 opacity-75" />
              <span className="relative inline-flex size-8 lg:size-16 rounded-full bg-peenk-500" />
            </span>
          </span>
          <div className="relative z-10 text-center">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Stop Waiting.{" "}
              <span className="font-handwriting text-5xl md:text-6xl lg:text-7xl text-gray-800">
                Start Anyway.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-10">
              Your ideas are worth creating, and the only step you need is the
              first one. Join the Start Anyway program today and begin your
              journey with support, tools, and a community cheering you on.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch md:items-center">
              <Link href={LINKS.external.workbook} target="_blank">
                <Button
                  size="sm"
                  className="w-full md:w-auto text-white text-lg px-24 py-8"
                >
                  Join the Workshop
                  <ArrowRight className="ml-2 size-6" />
                </Button>
              </Link>
              <Link href={LINKS.events}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full md:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 hover:text-white text-lg px-12 py-8"
                >
                  <Calendar className="mr-2 size-6" />
                  See Upcoming Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Join women from all walks of life who are starting anyway
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-grin-500" />
              <span>No experience required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-perple-500" />
              <span>Supportive community</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ohrange-500" />
              <span>Proven framework</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
