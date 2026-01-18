"use client";
import { useRef } from "react";
import { useViewport } from "@/lib/hook/useViewport";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const WhoThisIsForSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isInViewport } = useViewport(ref, {
    threshold: 0.5,
    direction: "both",
  });

  const points = [
    "Have ideas they've been too afraid to act on",
    "Feel stuck in planning or overthinking",
    "Want guidance, structure, and accountability",
    "Need a supportive community to cheer them on",
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 text-center">
          Who{" "}
          <span className="font-handwriting text-ohrange-500 text-5xl md:text-6xl lg:text-7xl">
            This{" "}
          </span>{" "}
          Is For
        </h2>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
          &quot;Start Anyway&quot; is for women who:
        </p>

        <div
          ref={ref}
          className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0"
        >
          {/* Left Card */}
          <div
            className={cn(
              "bg-ohrange-50 border border-ohrange-100 p-8 rounded-3xl",
              "transition-transform duration-500",
              isInViewport && "lg:rotate-1",
            )}
          >
            <div className="space-y-6">
              {points.slice(0, 2).map((point, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-ohrange-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed pt-1">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div
            className={cn(
              "bg-ohrange-50 border border-ohrange-100 p-8 rounded-3xl",
              "transition-transform duration-500",
              isInViewport && "lg:-rotate-1",
            )}
          >
            <div className="space-y-6">
              {points.slice(2, 4).map((point, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-ohrange-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed pt-1">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "mt-8 bg-linear-to-br from-ohrange-50 to-peenk-50 border border-ohrange-100 p-8 rounded-3xl text-center",
              "transition-transform duration-500",
              //   isInViewport && "lg:scale-105",
              "col-span-2",
            )}
          >
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic">
              No matter your background, schedule, or stage in life, this is a
              toolkit designed for you to take your next step{" "}
              <span className="font-semibold text-perple-600">
                without fear
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsForSection;
