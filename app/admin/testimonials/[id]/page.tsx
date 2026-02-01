"use client";

import { use } from "react";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";
import {
  useAdminTestimonials,
  useUpdateTestimonial,
} from "@/lib/tanstack/hooks/admin/useTestimonials";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: testimonialsData } = useAdminTestimonials({
    page: 1,
    limit: 100,
  });
  const testimonial = testimonialsData?.data?.find((t) => t.id === id);

  const { mutate: updateTestimonial, isPending } = useUpdateTestimonial({
    onSuccess: () => {
      toast.success("Testimonial updated successfully!");
      router.push("/admin/testimonials");
    },
    onError: (error) => {
      toast.error(`Failed to update testimonial: ${error.message}`);
    },
  });

  if (!testimonial) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">Testimonial not found</p>
            <Link
              href="/admin/testimonials"
              className="mt-4 inline-block text-ohrange-600"
            >
              Back to Testimonials
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          Edit Testimonial
        </h1>
      </div>

      <TestimonialForm
        defaultValues={testimonial}
        onSubmit={(data) => updateTestimonial({ id, data })}
        isSubmitting={isPending}
        submitText="Update Testimonial"
      />
    </div>
  );
}
