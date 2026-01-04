import TESTIMONIALS from "@/components/constants/testimonials";
import TestimonialCard from "@/components/ui/testimonial-card";

const TestimonialsSection = () => {
  return (
    <section className="py-8 sm:py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 gap-12">
        <div className="h-full">
          <h2 className="font-heading text-5xl  md:text-7xl font-semibold text-gray-900 mb-4 text-center md:text-left sticky top-28">
            The Proof is in the{" "}
            <span className="font-handwriting text-perple-500 text-6xl md:text-8xl">
              Passion
            </span>
          </h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 ">
          {/* Testimonial Cards */}
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
