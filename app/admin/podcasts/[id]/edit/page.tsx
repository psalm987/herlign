"use client";

import { use } from "react";
import { PodcastForm } from "@/components/admin/forms/podcast-form";
import {
  useAdminPodcast,
  useUpdatePodcast,
} from "@/lib/tanstack/hooks/admin/usePodcasts";
import { type PodcastUpdate } from "@/lib/validators/podcasts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPodcastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: podcastData, isLoading } = useAdminPodcast(id);
  const { mutate: updatePodcast, isPending } = useUpdatePodcast({
    onSuccess: () => {
      toast.success("Podcast updated successfully!");
      router.push("/admin/podcasts");
    },
    onError: (error) => {
      toast.error(`Failed to update podcast: ${error.message}`);
    },
  });

  const handleSubmit = (data: PodcastUpdate) => {
    updatePodcast({ id, data });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading podcast...</p>
      </div>
    );
  }

  if (!podcastData?.data) {
    return (
      <div className="p-6">
        <p className="text-red-600">Podcast not found</p>
        <Link
          href="/admin/podcasts"
          className="text-ohrange-600 hover:underline"
        >
          Back to Podcasts
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/podcasts"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Podcasts
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Edit Podcast
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Update podcast visibility settings
        </p>
      </div>

      <PodcastForm
        defaultValues={podcastData.data}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitText="Update Podcast"
        isEditMode
      />
    </div>
  );
}
