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
            Stuck? Overwhelmed? Good
          </p>

          <p className="font-sans text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
            Your antidote to creative paralysis is waiting. The &quote;Start
            Anyway&quot; hub has everything you need to kick perfectionism to
            the curb and ship your work.
          </p>

          <Button asChild size="lg" className="bg-perple-500">
            <Link href="/start-anyway"> Raid the Toolkit</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
