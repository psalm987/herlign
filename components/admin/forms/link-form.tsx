"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { linkSchema, type LinkInput } from "@/lib/validators/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UnsavedChangesWarning } from "@/components/admin/unsaved-changes-warning";

interface LinkFormProps {
  defaultValues?: Partial<LinkInput>;
  onSubmit: (data: LinkInput) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export function LinkForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Link",
}: LinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LinkInput>({
    resolver: zodResolver(linkSchema),
    defaultValues: defaultValues || {},
  });

  return (
    <>
      <UnsavedChangesWarning isDirty={isDirty} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Link Details
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                {...register("name")}
                placeholder="e.g., LinkedIn Learning"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <Input
                {...register("href")}
                placeholder="https://example.com"
                className={errors.href ? "border-red-500" : ""}
              />
              {errors.href && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.href.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Input
                {...register("category")}
                placeholder="e.g., Learning, Community, Tools"
                className={errors.category ? "border-red-500" : ""}
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.category.message}
                </p>
              )}
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
    </>
  );
}
