"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/lib/validators/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MediaPickerModal } from "@/components/admin/media-picker-modal";
import { UnsavedChangesWarning } from "@/components/admin/unsaved-changes-warning";
import { useState } from "react";
import { Image as ImageIcon, X, Star } from "lucide-react";
import Image from "next/image";

interface TestimonialFormProps {
  defaultValues?: Partial<TestimonialInput>;
  onSubmit: (data: TestimonialInput) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export function TestimonialForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Testimonial",
}: TestimonialFormProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
    filename: string;
  } | null>(
    defaultValues?.avatar_url
      ? { id: "", url: defaultValues.avatar_url, filename: "" }
      : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: defaultValues || {
      rating: 5,
      is_approved: false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchRating = watch("rating");

  const handleFormSubmit = (data: TestimonialInput) => {
    if (selectedImage) {
      data.avatar_url = selectedImage.url;
    }
    onSubmit(data);
  };

  return (
    <>
      <UnsavedChangesWarning isDirty={isDirty} />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Reviewer Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviewer Name *
              </label>
              <Input
                {...register("reviewer_name")}
                placeholder="Enter reviewer name"
                className={errors.reviewer_name ? "border-red-500" : ""}
              />
              {errors.reviewer_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.reviewer_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviewer Title
              </label>
              <Input
                {...register("reviewer_title")}
                placeholder="e.g., Software Engineer at Google"
                className={errors.reviewer_title ? "border-red-500" : ""}
              />
              {errors.reviewer_title && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.reviewer_title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar Image
              </label>
              {selectedImage ? (
                <div className="relative inline-block">
                  <Image
                    src={selectedImage.url}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-2 border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setValue("avatar_url", undefined);
                    }}
                    className="absolute -right-1 -top-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMediaPickerOpen(true)}
                  className="gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Select Avatar
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Testimonial
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setValue("rating", star, { shouldDirty: true })
                    }
                    className="transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (watchRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review *
              </label>
              <textarea
                {...register("review")}
                rows={6}
                className={`w-full rounded-md border ${
                  errors.review ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grin-600`}
                placeholder="Enter testimonial review..."
              />
              {errors.review && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.review.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("is_approved")}
                  className="rounded border-gray-300 text-grin-600 focus:ring-grin-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Approved
                </span>
              </label>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitText}
          </Button>
        </div>
      </form>

      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(media) => {
          setSelectedImage(media);
          setValue("avatar_url", media.url, { shouldDirty: true });
        }}
        selectedId={selectedImage?.id}
      />
    </>
  );
}
