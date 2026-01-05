import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
import Image from "next/image";
import { Check } from "lucide-react";

const BENEFITS = [
  "Women who understand your journey",
  "Daily encouragement and shared wins",
  "Real conversations",
  "A safe space to ask questions and try again",
  "Events, workshops and meetups designed with you in mind",
];

export function HypeSquadSection() {
  return (
    <section className=" bg-grin-500 relative overflow-hidden">
      <Image
        src="/images/jpeg/herlign5.jpeg"
        alt=""
        fill
        className="absolute h-auto w-screen object-cover align-top"
      />
      <div className="py-20 md:py-28 px-4 relative">
        <div className="max-w-3xl mx-auto py-8 sm:py-12 lg:py-18 px-4 sm:px-6 lg:px-8 bg-white rounded-lg border border-lermorn-50 animate-subtle-lift-with-pause ">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              Meet Your{" "}
              <span className="font-handwriting text-4xl sm:text-3xl md:text-6xl text-grin-400">
                Hype Squad
              </span>{" "}
            </h2>

            <p className="font-sans text-lg md:text-xl text-gray-700 mb-8">
              We get it, creativity can feel lonely and overwhelming. Every once
              in a while, you need your battery recharged, and this is why we
              exist!
            </p>
            <p className="font-sans text-lg md:text-xl text-gray-700 mb-8">
              Inside our community, you&apos;ll find:
            </p>
            <ul>
              {BENEFITS.map((benefit) => (
                <li key={benefit}>
                  <span className="bg-perple-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
                    <Check />
                  </span>{" "}
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="font-sans text-lg md:text-xl text-gray-700 mb-8">
              You&apos;re the missing piece in our puzzle, and we cannot wait to
              meet you!
            </p>
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="bg-ohrange-500 ">
              <Link href="https://forms.gle/ErugkNVzSk6mVqUr8" target="_blank">
                Join the Herlign Hive
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
