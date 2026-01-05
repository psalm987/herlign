"use client";
import { useViewport } from "@/lib/hook/useViewport";
import { cn } from "@/lib/utils";
import React from "react";

const FancyProgressBar = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { isInViewport } = useViewport(ref as React.RefObject<Element>, {
    threshold: 0.2,
  });
  return (
    <div
      ref={ref}
      className="w-full h-18 bg-gray-300 rounded-full border-4 inner-shadow box-shadow-s"
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
        }}
        className={cn(
          "inner w-3/4 h-full text-center text-xs text-white bg-lermorn-600 rounded-full progress-animation",
          isInViewport ? "visible" : "not-visible"
        )}
      />
    </div>
  );
};

export default FancyProgressBar;
