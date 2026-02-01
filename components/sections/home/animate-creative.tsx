import { cn } from "@/lib/utils";
import React from "react";

const AnimateCreative = () => {
  return (
    <svg
      viewBox="0 0 460 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block w-36 sm:w-44 md:w-60 lg:w-90"
    >
      <defs>
        <text
          id="ld"
          x="0"
          y="100"
          className={cn(
            "font-handwriting text-9xl",
            // "stroke-2 stroke-ohrange-500",
          )}
        >
          Creative
        </text>
        <clipPath id="clip">
          <use xlinkHref="#ld" />
        </clipPath>
      </defs>
      <g>
        <use
          xlinkHref="#ld"
          className={cn(
            "stroke-40 stroke-ohrange-500 fill-ohrange-100",
            "[stroke-dasharray:400] [stroke-dashoffset:400] [stroke-linecap:round] animate-draw-long",
          )}
          clipPath="url(#clip)"
        />
      </g>
    </svg>
  );
};

export default AnimateCreative;
