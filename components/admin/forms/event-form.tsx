"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventInput } from "@/lib/validators/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MediaPickerModal } from "@/components/admin/media-picker-modal";
import { UnsavedChangesWarning } from "@/components/admin/unsaved-changes-warning";
import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

import { DevTool } from "@hookform/devtools";

import { ForwardRefEditor } from "@/components/ui/editor/mdx-ref";

interface EventFormProps {
  defaultValues?: Partial<EventInput>;
  onSubmit: (data: EventInput) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export function EventForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Event",
}: EventFormProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
    filename: string;
  } | null>(
    defaultValues?.image_url
      ? { id: "", url: defaultValues.image_url, filename: "" }
      : null,
  );

  const {
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    control,
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues || {
      type: "event",
      mode: "live",
      status: "draft",
      is_paid: false,
      featured: false,
      price: 0,
    },
  });

  const watchIsPaid = useWatch({
    control,
    name: "is_paid",
  });

  const handleFormSubmit = (data: EventInput) => {
    if (selectedImage) {
      data.image_url = selectedImage.url;
    }
    // Date/time normalization is handled by the Zod validator 
    // to avoid double-conversion that can shift or drop the time component.
    console.log("Submitting form with data:", data);
    onSubmit(data);
  };

  return (
    <>
      <UnsavedChangesWarning isDirty={isDirty} />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Basic Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    {...field}
                    placeholder="Enter event title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="w-full rounded-md border border-gray-300 p-0">
                    <ForwardRefEditor
                      markdown={field.value || ""}
                      onChange={(markdown: string) => field.onChange(markdown)}
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    {...field}
                    className={`w-full rounded-md border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grin-600`}
                  >
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="mode"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode *
                  </label>
                  <select
                    {...field}
                    className={`w-full rounded-md border ${
                      errors.mode ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grin-600`}
                  >
                    <option value="live">Live</option>
                    <option value="online">Online</option>
                  </select>
                  {errors.mode && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.mode.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    {...field}
                    className={`w-full rounded-md border ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grin-600`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="slug"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="event-slug (auto-generated if empty)"
                    className={errors.slug ? "border-red-500" : ""}
                  />
                  {errors.slug && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </Card>

        {/* Date & Time */}
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Date & Time
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <Input
                    {...field}
                    type="datetime-local"
                    className={errors.start_date ? "border-red-500" : ""}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="end_date"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <Input
                    {...field}
                    type="datetime-local"
                    className={errors.end_date ? "border-red-500" : ""}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </Card>

        {/* Additional Details */}
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Additional Details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="external_link"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External Link (Zoom, etc.)
                  </label>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="https://zoom.us/j/..."
                    className={errors.external_link ? "border-red-500" : ""}
                  />
                  {errors.external_link && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.external_link.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="max_attendees"
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attendees
                  </label>
                  <Input
                    {...field}
                    type="number"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="50"
                    className={errors.max_attendees ? "border-red-500" : ""}
                  />
                  {errors.max_attendees && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.max_attendees.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="is_paid"
              render={({ field }) => (
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="rounded border-gray-300 text-ohrange-600 focus:ring-ohrange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Paid Event
                    </span>
                  </label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="rounded border-gray-300 text-ohrange-600 focus:ring-ohrange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Featured Event
                    </span>
                  </label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <div className={`${watchIsPaid ? "" : "hidden"}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    value={field.value || 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
            />
          </div>
        </Card>

        {/* Image */}
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Event Image
          </h2>
          <div>
            {selectedImage ? (
              <div className="relative inline-block">
                <Image
                  src={selectedImage.url}
                  alt="Event image"
                  height={200}
                  width={200}
                  className="h-48 w-auto rounded-lg border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setValue("image_url", undefined);
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
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
                Select Image
              </Button>
            )}
          </div>
        </Card>

        {/* Submit */}
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
      <DevTool control={control} />

      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(media) => {
          setSelectedImage(media);
          setValue("image_url", media.url, { shouldDirty: true });
        }}
        selectedId={selectedImage?.id}
      />
    </>
  );
}
