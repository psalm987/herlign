"use client";
import { useRef } from "react";
import { useViewport } from "@/lib/hook/useViewport";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FounderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isInViewport } = useViewport(ref, {
    threshold: 0.5,
    direction: "both",
  });
  return (
    <section className="py-8 sm:py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 " ref={ref}>
        <h2 className="font-heading text-4xl  md:text-6xl font-semibold text-gray-900 mb-6 lg:mb-8 lg:text-center max-w-xl lg:mx-auto">
          Meet the Woman Behind{" "}
          <span className="font-handwriting text-ohrange-500 text-5xl md:text-7xl">
            Herlign
          </span>
        </h2>
        <div>
          <div className="lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-8">
            <div
              className={cn(
                "flex items-center  h-full",
                "lg:bg-ohrange-50 lg:border lg:border-ohrange-100",
                "p-0 pb-8 lg:p-8 lg:rounded-3xl",
                "transition-transform duration-500",
                isInViewport && "lg:rotate-2",
              )}
            >
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic text-left lg:text-right">
                Hi, I&apos;m{" "}
                <span className="font-handwriting text-xl md:text-2xl text-ohrange-500">
                  Maureen Dede
                </span>
                , the heart behind <strong>Herlign Female Creatives</strong>. I
                started this community because I was tired of seeing brilliant
                women with world-changing ideas get stuck in the planning phase.
                Herlign is the space I wish I had when I was figuring out my own
                creative path.
              </p>
            </div>
            <div
              className={cn(
                "shrink-0 h-full w-full min-h-200 lg:min-h-0 overflow-hidden relative rounded-lg lg:rounded-3xl after:content-[''] after:bg-linear-to-b after:from-transparent after:to-black after:from-50% lg:after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:absolute after:inset-0 lg:after:rounded-3xl group ",
                "transition-transform duration-500",
                isInViewport && "lg:-rotate-4",
              )}
            >
              <Image
                src="/images/jpeg/maureen1.jpeg"
                alt="Maureen Dede"
                fill
                className="object-cover h-full w-full"
              />
              <div className="text-white absolute bottom-0 w-full p-8 z-10 group-hover:opacity-100 lg:opacity-0 transition-opacity duration-600 delay-100">
                <h6 className="font-heading font-medium text-2xl">
                  Maureen Dede
                </h6>
                <p className="opacity-70 text-ohrange-300">Founder</p>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center  h-full lg:bg-ohrange-50 lg:border lg:border-ohrange-100 p-0 pt-8 lg:p-8 lg:rounded-3xl",
                "transition-transform duration-500",
                isInViewport && "lg:-rotate-2",
              )}
            >
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic h-full">
                It&apos;s a place where women can be ambitious and authentic,
                supported and challenged; all at the same time. Every workshop,
                event, and conversation we create is built to remind women that
                they are not alone, their ideas matter, and their first step is
                always enough.
                <br />
                <br />
                <Link
                  href="https://www.youtube.com/shorts/j70xfmIZtUo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-perple-500 hover:underline font-medium"
                >
                  Watch my story
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
