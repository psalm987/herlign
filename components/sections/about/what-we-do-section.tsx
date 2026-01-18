import ActivityCard from "@/components/ui/activity";
import { Calendar, Mic2, GraduationCap, Users } from "lucide-react";

const ACTIVITIES = [
  // First row: 2 cards
  {
    title: "Events & Workshops",
    description: "Hands-on experiences to spark creativity",
    icon: Calendar,
    color: "grin" as const,
  },
  {
    title: "Seminars & Masterclasses",
    description: "Practical skills, inspiration, and mentorship",
    icon: GraduationCap,
    color: "lermorn" as const,
    featured: true,
  },

  // Second row: 2 cards
  {
    title: "Talk Shows & Podcasts",
    description: "Stories, insights, and real talk from women just like you",
    icon: Mic2,
    color: "lermorn" as const,
    featured: true,
    image: "/images/jpeg/herlign1.jpeg",
  },
  {
    title: "Community Conversations",
    description: "Support, feedback, and connection with your tribe",
    icon: Users,
    color: "grin" as const,
  },
];

const WhatWeDoSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 relative overflow-hidden bg-white">
      {/* Decorative background elements */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-semibold text-gray-900 mb-4">
            What We Do
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We bring women together to learn, share, and grow through:
          </p>
        </div>

        {/* Bento-style asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-6">
          {ACTIVITIES.map((activity) => (
            <div
              key={activity.title}
              className={activity.featured ? "md:col-span-7" : "md:col-span-5"}
            >
              <ActivityCard {...activity} />
            </div>
          ))}
        </div>

        {/* Closing statement card */}
        <div className="relative">
          <div className="">
            <div className="bg-lermorn-500 rounded-2xl p-8 md:p-12 text-center ">
              <p className="font-sans text-2xl md:text-3xl text-gray-700 leading-relaxed">
                Whether online or in-person, our goal is to help women feel{" "}
                <span className="text-grin-600 font-bold">empowered</span>,{" "}
                <span className="text-perple-600 font-bold">equipped</span>, and{" "}
                <span className="text-ohrange-600 font-bold">unstoppable</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
