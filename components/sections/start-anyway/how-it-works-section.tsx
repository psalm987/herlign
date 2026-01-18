"use client";
import { useRef } from "react";
import { useViewport } from "@/lib/hook/useViewport";
import { cn } from "@/lib/utils";
import { UserPlus, BookOpen, Users, Rocket } from "lucide-react";

const HowItWorksSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isInViewport } = useViewport(ref, {
    threshold: 0.5,
    direction: "both",
  });

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Join the Start Anyway program and access your toolkit.",
      icon: UserPlus,
      bgColor: "bg-grin-50",
      borderColor: "border-grin-100",
      iconBg: "bg-grin-500",
      numberBg: "bg-grin-600",
      rotation: "lg:rotate-2",
    },
    {
      number: "2",
      title: "Dive In",
      description:
        "Use the workbook, explore the resources, and follow the guided exercises.",
      icon: BookOpen,
      bgColor: "bg-ohrange-50",
      borderColor: "border-ohrange-100",
      iconBg: "bg-ohrange-500",
      numberBg: "bg-ohrange-600",
      rotation: "lg:-rotate-1",
    },
    {
      number: "3",
      title: "Engage",
      description:
        "Participate in workshops, ask questions, and connect with other women in the community.",
      icon: Users,
      bgColor: "bg-perple-50",
      borderColor: "border-perple-100",
      iconBg: "bg-perple-500",
      numberBg: "bg-perple-600",
      rotation: "lg:rotate-1",
    },
    {
      number: "4",
      title: "Start",
      description:
        "Take action, track your progress, celebrate wins, and keep moving forward.",
      icon: Rocket,
      bgColor: "bg-peenk-50",
      borderColor: "border-peenk-100",
      iconBg: "bg-peenk-500",
      numberBg: "bg-peenk-600",
      rotation: "lg:-rotate-2",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4" ref={ref}>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 text-center">
          How It{" "}
          <span className="font-handwriting text-peenk-500 text-5xl md:text-6xl lg:text-7xl">
            Works
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
          We use a simple but proven 4-step framework to get you started:
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            // const Icon = step.icon;
            return (
              <div
                key={idx}
                className={cn(
                  step.bgColor,
                  "border",
                  step.borderColor,
                  "p-6 rounded-3xl",
                  "transition-all duration-500",
                  isInViewport && step.rotation,
                  //   "hover:shadow-lg hover:scale-105",
                  "bg-ohrange-50 border-ohrange-100",
                )}
              >
                {/* <div
                  className={cn(
                    "size-16  rounded-2xl flex items-center justify-center mb-4",
                    step.iconBg,
                  )}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div> */}
                <p
                  className={cn(
                    "inline-flex aspect-square items-center justify-center w-10 h-10 rounded-full mb-3 text-lg font-bold text-white",
                    step.numberBg,
                    // "bg-ohrange-500",
                  )}
                >
                  {step.number}
                </p>
                <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
