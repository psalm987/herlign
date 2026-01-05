import Link from "next/link";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "@next/third-parties/google";
import LINKS from "@/components/constants/links";

export function YoutubeSection() {
  return (
    <section className="py-20 md:py-28 bg-peenk-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <div className="flex-1 aspect-video overflow-x-hidden md:min-h-80 w-full">
            <YouTubeEmbed
              style=""
              videoid="Ts6Z0lVStzg" // Replace with your video's ID
            />
          </div>
          <div className="text-left max-w-2xl flex-1">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6 text-pretty">
              A Safe Space for Women who want{" "}
              <span className="font-handwriting text-4xl sm:text-5xl md:text-6xl text-peenk-600">
                More.
              </span>
            </h2>

            <p className="font-sans text-lg md:text-lg text-gray-700 mb-10 leading-relaxed">
              Get your daily dose of inspiration from women who are building
              stuff. We are a circle of ambitious women showing up for ourselves
              daily. Here, you&apos;ll find motivation, honest conversations,
              and women who remind you that growth is possible.
            </p>

            <Button asChild size="lg" className="bg-ohrange-500">
              <Link
                href={LINKS.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch our previous Herlign Voices episodes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
