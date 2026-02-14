"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  podcastUpdateSchema,
  type PodcastUpdate,
} from "@/lib/validators/podcasts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UnsavedChangesWarning } from "@/components/admin/unsaved-changes-warning";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/ui/text-field";

interface PodcastFormProps {
  defaultValues?: Partial<PodcastUpdate> & {
    youtube_video_id?: string;
    title?: string;
    description?: string | null;
  };
  onSubmit: (data: PodcastUpdate) => void;
  isSubmitting?: boolean;
  submitText?: string;
  isEditMode?: boolean;
}

export function PodcastForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Podcast",
  //   isEditMode = false,
}: PodcastFormProps) {
  const {
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm<PodcastUpdate>({
    resolver: zodResolver(podcastUpdateSchema),
    defaultValues: defaultValues || {
      is_visible: true,
    },
  });

  return (
    <>
      <UnsavedChangesWarning isDirty={isDirty} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Podcast Information
          </h2>
          <div className="gap-4 flex flex-col lg:grid lg:grid-cols-2">
            {/* Title (Read-only in edit mode) */}
            <Controller
              control={control}
              disabled={isSubmitting}
              name="title"
              render={({ field }) => (
                <TextField
                  label="Title"
                  {...field}
                  errorMessage={errors?.title?.message}
                />
              )}
            />

            {/* YouTube Video ID (Read-only) */}
            <Controller
              control={control}
              name="youtube_video_id"
              disabled={isSubmitting}
              render={({ field }) => (
                <TextField
                  label="YouTube Video ID"
                  {...field}
                  helperText={
                    field.value &&
                    field.value.length === 11 && (
                      <a
                        href={`https://youtube.com/watch?v=${field.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ohrange-600 hover:underline"
                      >
                        View on YouTube →
                      </a>
                    )
                  }
                  errorMessage={errors?.youtube_video_id?.message}
                />
              )}
            />

            {/* Description (Read-only) */}
            <Controller
              control={control}
              name="description"
              disabled={isSubmitting}
              render={({ field }) => (
                <TextField
                  label="Description"
                  {...field}
                  value={field.value || ""}
                  containerClassName="col-span-2"
                  errorMessage={errors?.description?.message}
                />
              )}
            />

            {/* Visibility Toggle (Editable) */}
            <Controller
              control={control}
              name="is_visible"
              disabled={isSubmitting}
              render={({ field }) => (
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 shrink-0 flex-1">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="is_visible"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="is_visible"
                      className="block text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      Visible on public page
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      When enabled, this podcast will be shown on the public
                      podcasts page
                    </p>
                  </div>
                  {errors.is_visible && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.is_visible.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-ohrange-600 hover:bg-ohrange-700"
          >
            {isSubmitting ? "Saving..." : submitText}
          </Button>
        </div>
      </form>
    </>
  );
}
