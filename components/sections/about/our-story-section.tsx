import { cn } from "@/lib/utils";
import { Compass, Eye, Heart, Sparkles } from "lucide-react";

const GOALS = [
  {
    title: "Be Seen",
    description: "Share their ideas, projects, and wins openly",
    icon: Eye,
    color: "peenk" as const,
  },
  {
    title: "Be Validated",
    description: "Feel supported and acknowledged in their efforts",
    icon: Heart,
    color: "ohrange" as const,
  },
  {
    title: "Stay Grounded",
    description: "Connect with values that guide growth",
    icon: Compass,
    color: "perple" as const,
  },
  {
    title: "Enjoy the Vibes",
    description: "Celebrate creativity, community, and fun",
    icon: Sparkles,
    color: "lermorn" as const,
  },
];

const OurStorySection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-4xl  md:text-6xl font-semibold text-gray-900 mb-4 max-w-xl mx-auto ">
            Our Story
          </h2>
          <p className="text-lg md:text-xl text-gray-500 mb-6 max-w-3xl mx-auto ">
            Herlign Female Creatives was born from a simple but powerful idea:
            women shouldn&apos;t have to navigate their creative journeys alone.
            We wanted to create a safe, inspiring space where women can:
          </p>
        </div>
        <div className=" mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((goal) => (
            <div
              key={goal.title}
              className={"bg-lermorn-50 p-6 pt-0 rounded-lg text-center "}
            >
              <div
                className={cn(
                  `mx-auto mb-4 size-16 flex items-center justify-center rounded-full -translate-y-8 bg-lermorn-50`,
                  {
                    ohrange: " text-ohrange-500",
                    perple: " text-perple-500",
                    peenk: " text-peenk-500",
                    grin: " text-grin-500",
                    lermorn: "text-lermorn-500",
                  }[goal.color]
                )}
              >
                <goal.icon className="size-8" />
              </div>
              <h3 className="font-sans text-xl font-extrabold text-gray-900/80 mb-2">
                {goal.title}
              </h3>
              <p className="text-gray-900/50">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
