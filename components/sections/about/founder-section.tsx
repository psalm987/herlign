import Link from "next/link";

const FounderSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 gap-12">
        <div className="h-full">
          <h2 className="font-heading text-4xl  md:text-6xl font-semibold text-gray-900 mb-4 md:text-left sticky top-28">
            Meet the Woman Behind{" "}
            <span className="font-handwriting text-ohrange-500 text-5xl md:text-7xl">
              Herlign
            </span>
          </h2>
        </div>
        <div>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
            &quot;Hi, I&apos;m{" "}
            <span className="font-handwriting text-xl md:text-2xl text-ohrange-500">
              Maureen Dede
            </span>
            , the heart behind <strong>Herlign Female Creatives</strong>. I
            started this community because I was tired of seeing brilliant women
            with world-changing ideas get stuck in the planning phase. Herlign
            is the space I wish I had when I was figuring out my own creative
            path.
            <br />
            <br />
            It&apos;s a place where women can be ambitious and authentic,
            supported and challenged; all at the same time. Every workshop,
            event, and conversation we create is built to remind women that they
            are not alone, their ideas matter, and their first step is always
            enough. &quot;
          </p>
          <Link
            href="https://www.youtube.com/shorts/j70xfmIZtUo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-perple-500 hover:underline font-medium"
          >
            Watch my story
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
