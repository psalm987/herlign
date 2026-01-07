import Image from "next/image";

const MissionSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-b relative from-lermorn-600 via-80% via-lermorn-700 to-lermorn-800 text-white p-20 rounded-2xl">
          <div className="max-w-md">
            <h2 className="font-heading text-4xl  md:text-6xl font-semibold mb-4 ">
              Our Mission is Simple
            </h2>
            <p className="text-lg md:text-xl mb-6  ">
              To empower women to show up, start anyway, and build boldly,
              whether you&apos;re exploring one passion, juggling many, or
              balancing work and motherhood. At Herlign, we believe that every
              woman deserves a community that cheers her on, challenges her, and
              celebrates her progress.
            </p>
          </div>
          <div className="mx-auto contain-content lg:absolute right-16 -top-8 rounded-lg lg:after:content-[''] lg:after:absolute lg:after:inset-0 lg:after:bg-linear-to-b lg:after:from-transparent lg:after:via-transparent lg:after:to-black lg:after:rounded-lg">
            <Image
              src="/images/jpeg/herlign3.jpeg"
              height={600}
              width={400}
              alt=""
              className="rounded-2xl w-full h-100 object-cover object-top lg:w-auto lg:h-auto"
            />
          </div>
        </div>

        <div className=" mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"></div>
      </div>
    </section>
  );
};

export default MissionSection;
