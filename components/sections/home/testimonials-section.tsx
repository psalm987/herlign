import TESTIMONIALS from "@/components/constants/testimonials";
import TestimonialCard from "@/components/ui/testimonial-card";
import Image from "next/image";

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-16 h-[300px] lg:h-[700px] px-0 overflow-hidden md:px-6 ">
          <Image
            fill
            alt="bento"
            src="/images/png/bento-md-with-pics.png"
            className="object-contain md:hidden  scale-150"
          />
          <Image
            fill
            alt="bento"
            src="/images/png/bento-lg-with-pics.png"
            className="object-contain hidden md:block"
          />
          <div className="absolute inset-0 -bottom-14 md:bottom-0 flex items-end justify-center pointer-events-none">
            <div className="text-center px-6 py-5 md:px-8 md:py-6 max-w-2xl mx-4">
              <span className="inline-block px-4 py-1.5 bg-perple-50 text-perple-700 rounded-full text-sm font-medium mb-3 md:mb-5">
                Testimonials
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900">
                Don&apos;t Just Take Our Word For It
              </h2>
            </div>
          </div>
        </div>
        {/* Bento Grid with Overlay */}

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {TESTIMONIALS.slice(0, 2).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} showRating />
          ))}
        </div>
      </div>
    </section>
  );
}
