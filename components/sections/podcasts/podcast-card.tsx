/**
 * Podcast Card Component
 * Displays individual podcast with YouTube embed
 */

import React from "react";
import type { Podcast } from "@/lib/actions/podcasts";
import { YouTubeEmbed } from "@next/third-parties/google";

interface PodcastCardProps {
  podcast: Podcast;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  return (
    <div className="group flex flex-col gap-3">
      {/* YouTube Embed */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <YouTubeEmbed videoid={podcast.youtube_video_id} style="" />
      </div>

      {/* Podcast Details */}
      <div className="flex flex-col gap-1">
        {/* Title */}
        <h3 className="font-medium text-base text-gray-900 line-clamp-2">
          {podcast.title}
        </h3>

        {/* Description */}
        {podcast.description && (
          <p className="line-clamp-2 text-sm text-gray-600">
            {podcast.description}
          </p>
        )}
      </div>
    </div>
  );
};
