"use client";

import { TestimonialForm } from "@/components/admin/forms/testimonial-form";
import { useCreateTestimonial } from "@/lib/tanstack/hooks/admin/useTestimonials";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTestimonialPage() {
  const router = useRouter();
  const { mutate: createTestimonial, isPending } = useCreateTestimonial({
    onSuccess: () => {
      toast.success("Testimonial created successfully!");
      router.push("/admin/testimonials");
    },
    onError: (error) => {
      toast.error(`Failed to create testimonial: ${error.message}`);
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Testimonials
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Add New Testimonial
        </h1>
      </div>

      <TestimonialForm onSubmit={createTestimonial} isSubmitting={isPending} />
    </div>
  );
}
