import HerlignPattern from "@/components/svg/herlign-pattern";

export function FounderSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-12 text-center">
          The Woman Behind the{" "}
          <span className="font-handwriting text-ohrange-500 text-4xl sm:text-5xl md:text-6xl">
            Madness.
          </span>
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              <div className="w-48 h-48 rounded-full bg-perple-200 overflow-hidden relative">
                {/* <div className="w-full h-full flex items-center justify-center text-perple-600 font-heading text-6xl">
                  H
                </div> */}
                <HerlignPattern size="600" className="absolute" />
              </div>
            </div>

            <div className="flex-1">
              <p className="font-sans text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                &quot;Hi, I&apos;m Maureen. I started Herling because I was
                tired of seeing brilliant women with world-changing ideas get
                stuck in the &apos;planning phase.&apos; I believe your first
                draft doesn&apos;t have to be perfect, it just has to exist.
                This isn&apos;t just a platform; it&apos;s the community I
                needed when I was starting out.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
