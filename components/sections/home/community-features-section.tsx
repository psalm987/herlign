import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Women who understand your journey",
  "Daily encouragement and shared wins",
  "Real conversations",
  "A safe space to ask questions and try again",
  "Events, workshops and meetups designed with you in mind",
];

export function CommunityFeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
            Meet Your Hype Squad
          </h2>

          <p className="font-sans text-lg md:text-xl text-gray-700 mb-8">
            We get it, creativity can feel lonely and overwhelming. Every once
            in a while, you need your battery recharged, and this is why we
            exist!
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="font-sans text-lg font-medium text-gray-900 mb-6 text-center">
            Inside our community, you&apos;ll find:
          </p>

          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-perple-600 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-sans text-base md:text-lg text-gray-700">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-sans text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
          You&apos;re the missing piece in our puzzle, and we cannot wait to
          meet you!
        </p>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/contact">Join the Herlign Hive</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
