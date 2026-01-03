import React from "react";
import { Card } from "./card";
import { Testimonial } from "../constants/testimonials";
import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  testimonial: Testimonial;
  showRating?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  showRating = false,
}) => {
  return (
    <Card className={`p-6 border-none shadow-none relative`}>
      <div className="flex flex-col h-full">
        {/* Star Rating */}
        {showRating && (
          <div className="flex gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-orange-400 text-orange-400"
              />
            ))}
          </div>
        )}

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
  );
};

export default TestimonialCard;
