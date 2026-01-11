import { cn } from "@/lib/utils";
import { Eye, Award, Anchor, MessageCircle, Zap } from "lucide-react";

const VALUES = [
  {
    title: "Visibility",
    description: "Ensures every woman's ideas and voice are seen.",
    icon: Eye,
    color: "grin" as const,
  },
  {
    title: "Validation",
    description:
      "Provides encouragement, recognition, and support along the way.",
    icon: Award,
    color: "peenk" as const,
  },
  {
    title: "Values",
    description:
      "Keep us grounded, fostering integrity, intention, and purpose in our creative work.",
    icon: Anchor,
    color: "perple" as const,
  },
  {
    title: "Vulnerability",
    description:
      "Offers a corner for women to share their heartfelt challenges and struggles, knowing they will be met with understanding, empathy, and solidarity.",
    icon: MessageCircle,
    color: "ohrange" as const,
  },
  {
    title: "Vibes",
    description:
      "Creates an uplifting, energizing environment where women can thrive.",
    icon: Zap,
    color: "lermorn" as const,
  },
];

const ValuesSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-semibold text-white mb-4">
            Our Values
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            At the heart of Herlign are five guiding values that shape
            everything we do.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {VALUES.map((value, index) => (
            <div
              key={value.title}
              className={cn(
                "bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8",
                "flex flex-col sm:flex-row items-start sm:items-center gap-6",
                index % 2 === 1 && "sm:flex-row-reverse",
                {
                  grin: "bg-grin-500 text-white shadow-grin-500/50",
                  peenk: "bg-peenk-500 text-gray-900 shadow-peenk-500/50",
                  perple: "bg-perple-500 text-white shadow-perple-500/50",
                  ohrange: "bg-ohrange-500 text-white shadow-ohrange-500/50",
                  lermorn: "bg-lermorn-500 text-gray-900 shadow-lermorn-500/50",
                }[value.color]
              )}
            >
              <div
                className={cn(
                  "shrink-0 size-20 md:size-24 flex items-center justify-center rounded-2xl",
                  {
                    grin: "bg-grin-300 text-grin-600",
                    peenk: "bg-peenk-300 text-peenk-600",
                    perple: "bg-perple-300 text-perple-600",
                    ohrange: "bg-ohrange-300 text-ohrange-600",
                    lermorn: "bg-lermorn-300 text-lermorn-600",
                  }[value.color]
                )}
              >
                <value.icon className="size-10 md:size-12" strokeWidth={1.5} />
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
