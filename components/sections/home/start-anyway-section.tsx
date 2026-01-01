import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StartAnywaySection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
            Start Anyway
          </h2>

          <p className="font-sans text-lg md:text-xl text-gray-700 mb-4">
            Overthinking? We know the feeling.
          </p>

          <p className="font-sans text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
            We created Start Anyway, a hands-on workshop and resource hub for
            women who need a gentle nudge to get started. If you&apos;re tired
            of planning and ready to begin, this is the perfect solution for
            you.
          </p>

          <Button asChild size="lg">
            <Link href="/start-anyway">Join the Next Workshop</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
