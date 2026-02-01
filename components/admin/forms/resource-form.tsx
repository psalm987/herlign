"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, type ResourceInput } from "@/lib/validators/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UnsavedChangesWarning } from "@/components/admin/unsaved-changes-warning";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface ResourceFormProps {
  defaultValues?: Partial<ResourceInput>;
  onSubmit: (data: ResourceInput) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export function ResourceForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Resource",
}: ResourceFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<ResourceInput>({
    resolver: zodResolver(resourceSchema),
    defaultValues: defaultValues || {
      format: "ebook",
      is_paid: false,
      price: 0,
      tags: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchIsPaid = watch("is_paid");

  const handleFormSubmit = (data: ResourceInput) => {
    data.tags = tags;
    onSubmit(data);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <>
      <UnsavedChangesWarning isDirty={isDirty} />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Basic Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                {...register("title")}
                placeholder="Enter resource title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={`w-full rounded-md border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grin-600`}
                placeholder="Enter resource description"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Link *
              </label>
              <Input
                {...register("external_link")}
                placeholder="https://example.com/resource"
                className={errors.external_link ? "border-red-500" : ""}
              />
              {errors.external_link && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.external_link.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format *
                </label>
                <select
                  {...register("format")}
                  className={`w-full rounded-md border ${
                    errors.format ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grin-600`}
                >
                  <option value="ebook">eBook</option>
                  <option value="guide">Guide</option>
                  <option value="template">Template</option>
                </select>
                {errors.format && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.format.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Input
                  {...register("category")}
                  placeholder="e.g., Career Development"
                  className={errors.category ? "border-red-500" : ""}
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("is_paid")}
                    className="rounded border-gray-300 text-ohrange-600 focus:ring-ohrange-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Paid Resource
                  </span>
                </label>
              </div>

              {watchIsPaid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="29.99"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>
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
