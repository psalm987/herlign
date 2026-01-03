import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function QuizSection() {
  return (
    <section className="py-20 md:py-28 bg-perple-700 bg-[url('/images/png/patterns/perple-600.png')] bg-repeat relative animate-[move-bg_30s_linear_infinite]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 text-pretty">
            What Kind of Creative Are You?
          </h2>

          <p className="font-sans text-lg md:text-xl text-white/90 mb-4 leading-relaxed">
            Are you a &quot;Soft Spark&quot; or a &quot;Big Energy&quot;?
            Discover your archetype and unlock your unique superpower.
          </p>

          <Button asChild size="xl" className="text-shadow-none">
            <Link
              href="https://tally.so/r/mBlYNA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Search className="size-6" /> Discover Your Creative Style
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
