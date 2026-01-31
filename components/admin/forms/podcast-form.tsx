"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  podcastUpdateSchema,
  type PodcastUpdate,
} from "@/lib/validators/podcasts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UnsavedChangesWarning } from "@/components/admin/unsaved-changes-warning";
import { Checkbox } from "@/components/ui/checkbox";

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
          <div className="space-y-4">
            {/* Title (Read-only in edit mode) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                value={defaultValues?.title || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                Title is synced from YouTube
              </p>
            </div>

            {/* YouTube Video ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video ID
              </label>
              <Input
                value={defaultValues?.youtube_video_id || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                {defaultValues?.youtube_video_id && (
                  <a
                    href={`https://youtube.com/watch?v=${defaultValues.youtube_video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-perple-600 hover:underline"
                  >
                    View on YouTube →
                  </a>
                )}
              </p>
            </div>

            {/* Description (Read-only) */}
            {defaultValues?.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={defaultValues.description}
                  disabled
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Description is synced from YouTube
                </p>
              </div>
            )}

            {/* Visibility Toggle (Editable) */}
            <Controller
              control={control}
              name="is_visible"
              render={({ field }) => (
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
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

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium mb-2">ℹ️ About Podcast Sync</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>
                  Podcast metadata (title, description, stats) is automatically
                  synced from YouTube
                </li>
                <li>You can only control visibility on this page</li>
                <li>
                  Use the &quot;Sync from YouTube&quot; button on the list page
                  to update all podcasts
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-grin-600 hover:bg-grin-700"
          >
            {isSubmitting ? "Saving..." : submitText}
          </Button>
        </div>
      </form>
    </>
  );
}
