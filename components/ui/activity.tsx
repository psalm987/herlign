import { cn } from "@/lib/utils";
import Image from "next/image";

interface ActivityCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  color: "grin" | "peenk" | "perple" | "ohrange" | "lermorn";
  featured?: boolean;
  image?: string;
}

const BACKGROUND_COLORS = {
  grin: "bg-grin-500",
  peenk: "bg-peenk-500",
  perple: "bg-perple-500",
  ohrange: "bg-ohrange-500",
  lermorn: "bg-lermorn-500",
};

// const DECORATIVE_COLORS = {
//   grin: "bg-grin-200",
//   peenk: "bg-peenk-700",
//   perple: "bg-perple-200",
//   ohrange: "bg-ohrange-200",
// };

const TEXT_COLORS = {
  grin: "text-grin-50",
  peenk: "text-gray-900",
  perple: "text-perple-50",
  ohrange: "text-ohrange-50",
  lermorn: "text-lermorn-950",
};

const ActivityCard = ({
  title,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon: Icon,
  color,
  featured,
  image,
}: ActivityCardProps) => {
  return (
    <div
      className={cn(
        "group h-full flex flex-col justify-end relative rounded-2xl transition-all duration-300 overflow-hidden",
        featured ? "p-8 md:p-10 min-h-64" : "p-6 md:p-8 min-h-56",
        image
          ? "after:absolute after:inset-0 after:bg-linear-to-b after:from-transparent after:to-black"
          : BACKGROUND_COLORS[color]
      )}
    >
      {image && (
        <Image
          src={image}
          alt=""
          fill
          className="absolute h-full w-full object-cover z-0 "
        />
      )}
      {/* Decorative corner accent */}
      {/* <span
        className={cn(
          "absolute top-0 right-0 w-20 h-20 rounded-bl-3xl rounded-tr-2xl transition-opacity opacity-10 group-hover:opacity-20",
          !image && DECORATIVE_COLORS[color]
        )}
      /> */}

      <div
        className={cn(
          "relative z-10",
          image ? "text-white" : TEXT_COLORS[color]
        )}
      >
        {/* <div
          className={cn(
            "inline-flex items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110",
            featured ? "size-16 md:size-20" : "size-14 md:size-16",
            {
              grin: "bg-grin-100 text-grin-600",
              peenk: "bg-peenk-100 text-peenk-600",
              perple: "bg-perple-100 text-perple-600",
              ohrange: "bg-ohrange-100 text-ohrange-600",
            }[color]
          )}
        >
          <Icon
            className={cn(
              "stroke-[3/2]",
              featured ? "size-8 md:size-10" : "size-7 md:size-8"
            )}
          />
        </div> */}

        <h3
          className={cn(
            "font-heading font-semibold mb-3",

            featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "opacity-60 leading-relaxed",
            featured ? "text-base md:text-lg" : "text-sm md:text-base"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
