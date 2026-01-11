import Image from "next/image";
import React from "react";

const WHO_WE_SERVE = [
  {
    title: "Aspiring Creatives",
    description: "Just starting out and hungry to learn",
    image: "/images/jpeg/aspiring-creatives.jpg",
  },
  {
    title: "9-to-5 Builders",
    description: "Balancing work while building their dream side hustles",
    image: "/images/jpeg/9-to-5-builders.jpg",
  },
  {
    title: "All-In Girlies",
    description: "Diving deep into one passion and giving it everything",
    image: "/images/jpeg/all-in-girlies.jpg",
  },
  {
    title: "Multi-Passionate Creatives",
    description: "Exploring many ideas, careers, or hobbies",
    image: "/images/jpeg/multi-passionate-creatives.jpg",
  },
  {
    title: "Working Mums",
    description: "Balancing motherhood with creativity and growth",
    image: "/images/jpeg/working-mums.jpg",
  },
];

const WhoWeServeSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-ohrange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-4xl  md:text-6xl font-semibold text-gray-900 mb-4 max-w-xl mx-auto ">
            Who We Serve
          </h2>
          <p className="text-lg md:text-xl text-gray-500 mb-6 max-w-3xl mx-auto ">
            We welcome women who are:
          </p>
        </div>
        <div className=" mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {WHO_WE_SERVE.map((who) => (
            <div
              key={who.title}
              className={
                "relative aspect-2/3 w-full rounded-2xl overflow-hidden"
              }
            >
              <Image
                src={who.image}
                alt=""
                fill
                className="absolute h-full w-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <span className="absolute bg-linear-to-b from-transparent to-black h-48 bottom-0 w-full" />
              <div className="p-8 absolute bottom-0 ">
                <h3 className="font-heading text-xl font-semibold text-white mb-2">
                  {who.title}
                </h3>
                <p className="text-white/80">{who.description}</p>
              </div>
            </div>
          ))}
          <p className="aspect-2/3 bg-ohrange-500 text-ohrange-100 text-center flex items-center rounded-2xl p-8 font-medium text-4xl">
            No matter where you are in your journey, Herlign is your creative
            home.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
