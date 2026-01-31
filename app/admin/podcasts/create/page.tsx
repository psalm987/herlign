"use client";

import { PodcastForm } from "@/components/admin/forms/podcast-form";
import { useCreatePodcast } from "@/lib/tanstack/hooks/admin/usePodcasts";
import { type PodcastUpdate } from "@/lib/validators/podcasts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPodcastPage() {
  const router = useRouter();
  const { mutate: createPodcast, isPending } = useCreatePodcast({
    onSuccess: () => {
      toast.success("Podcast created successfully!");
      router.push("/admin/podcasts");
    },
    onError: (error) => {
      toast.error(`Failed to create podcast: ${error.message}`);
    },
  });

  const handleSubmit = (data: PodcastUpdate) => {
    // For manual creation, we'd need to provide YouTube video ID
    // This is primarily handled by sync, but keeping for completeness
    if (!data.youtube_video_id) {
      toast.error("YouTube video ID is required");
      return;
    }
    createPodcast(data as never);
  };

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
          Add New Podcast
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manually add a podcast video (&quot;Sync from YouTube&quot; is
          currently not available)
        </p>
      </div>

      {/* <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 mb-6">
        <p className="text-sm text-yellow-900">
          <strong>Tip:</strong> It&apos;s recommended to use the &quot;Sync from
          YouTube&quot; button on the podcasts list page instead of manually
          creating podcasts. The sync will automatically fetch all videos from
          your configured YouTube channel.
        </p>
      </div> */}

      <PodcastForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitText="Create Podcast"
      />
    </div>
  );
}
