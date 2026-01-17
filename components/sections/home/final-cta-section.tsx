import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="py-20 md:py-28 bg-linear-to-br from-perple-500 to-perple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6">
          Your next chapter is waiting
        </h2>

        <p className="font-sans text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
          Join the community, connect with other creatives, and start the
          journey you&apos;ve been postponing.
        </p>

        <Button asChild size="lg" className="bg-ohrange-500">
          <Link href="/contact">Join the Herlign Community</Link>
        </Button>
      </div>
    </section>
  );
}
