import { cn } from "@/lib/utils";
import { Eye, Award, Anchor, MessageCircle, Zap } from "lucide-react";

const VALUES = [
  {
    title: "Visibility",
    description: "Every woman's ideas and voice are seen.",
    icon: Eye,
    color: "peenk" as const,
  },
  {
    title: "Validation",
    description: "Encouragement, recognition, and support along the way.",
    icon: Award,
    color: "ohrange" as const,
  },
  {
    title: "Values",
    description: "Grounding us with integrity, intention, and purpose.",
    icon: Anchor,
    color: "perple" as const,
  },
  {
    title: <>Vulner&shy;ability</>,
    description:
      "A safe space to share challenges, met with empathy and solidarity.",
    icon: MessageCircle,
    color: "grin" as const,
  },
  {
    title: "Vibes",
    description: "An uplifting, energizing environment where women thrive.",
    icon: Zap,
    color: "lermorn" as const,
  },
];

const ValuesSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-24">
          <h2 className="font-heading text-4xl md:text-6xl font-semibold text-white mb-4">
            Our Values
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            At the heart of Herlign are five guiding values that shape
            everything we do.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-y-8">
          {VALUES.map((value) => (
            <div
              key={value.description}
              className={cn(
                "bg-white  z-10 hover:z-0 transition-shadow p-6 md:p-8 lg:pt-24 relative rounded-4xl lg:rounded-none",
                "flex flex-col sm:flex-row items-start sm:items-center gap-6",
                {
                  grin: "bg-grin-500 text-grin-50 shadow-grin-500/50",
                  peenk: "bg-peenk-500 text-peenk-950 shadow-peenk-500/50",
                  perple: "bg-perple-500 text-perple-50 shadow-perple-500/50",
                  ohrange:
                    "bg-ohrange-500 text-ohrange-50 shadow-ohrange-500/50",
                  lermorn:
                    "bg-lermorn-500 text-lermorn-950 shadow-lermorn-500/50",
                }[value.color]
              )}
            >
              <div
                className={cn(
                  "shrink-0 size-20 md:size-18 lg:outline-16 lg:outline-gray-800 flex items-center justify-center rounded-2xl lg:absolute lg:-top-10 lg:left-1/2 lg:transform lg:-translate-x-1/2",
                  {
                    grin: "bg-grin-500 text-grin-50",
                    peenk: "bg-peenk-500 text-peenk-950",
                    perple: "bg-perple-500 text-perple-50",
                    ohrange: "bg-ohrange-500 text-ohrange-50",
                    lermorn: "bg-lermorn-500 text-lermorn-950",
                  }[value.color]
                )}
              >
                <value.icon className="size-10" strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <h3 className="font-heading text-2xl md:text-3xl font-semibold  mb-2">
                  {value.title}
                </h3>
                <p className="text-base md:text-lg opacity-70 ">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
