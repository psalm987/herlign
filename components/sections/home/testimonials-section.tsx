import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Ada",
    role: "Designer",
    quote:
      "I joined Herlign during a season where I felt stuck. In just weeks, I found clarity, support, and women who understood me. This space feels like home.",
    // image: "https://picsum.photos/seed/ada/100/100",
    rating: 5,
  },
  {
    name: "Tolu",
    role: "Working Mum",
    quote:
      "Finally, a community where I don't feel judged for wanting more. Herlign helped me start the projects I'd been scared of for years.",
    // image: "https://picsum.photos/seed/tolu/100/100",
    rating: 5,
  },
  // {
  //   name: "Chioma",
  //   role: "Content Creator",
  //   quote:
  //     "The supportive environment at Herlign gave me the confidence to pursue my creative dreams. I&apos;ve grown so much since joining!",
  //   image: "https://picsum.photos/seed/chioma/100/100",
  //   rating: 5,
  // },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-16 h-[300px] md:h-[500px] lg:h-[700px] px-6">
          <Image
            fill
            alt="bento"
            src="/images/png/bento-md-with-pics.png"
            className="object-contain md:hidden"
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
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`p-6 border-none shadow-none relative`}
            >
              <div className="flex flex-col h-full">
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-sans text-sm md:text-base text-gray-700 mb-6 leading-relaxed grow">
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-sans text-md font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-xs text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
