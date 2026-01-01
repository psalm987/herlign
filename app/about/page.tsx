import { Navigation } from "@/components/sections/general/navigation";
import { Footer } from "@/components/sections/general/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-gray-900 mb-8">
            About Herlign
          </h1>
          <p className="font-sans text-xl text-gray-700 mb-8">
            Content coming soon...
          </p>
          <Button asChild className="bg-perple-600 hover:bg-perple-700">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
