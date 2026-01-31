/**
 * Podcast Card Component
 * Displays individual podcast with YouTube embed
 */

import React from "react";
import { Calendar, Eye, ThumbsUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Podcast } from "@/lib/actions/podcasts";
import { formatDate } from "@/lib/utils/date";
import { parseYouTubeDuration } from "@/lib/services/youtube";
import { YouTubeEmbed } from "@next/third-parties/google";

interface PodcastCardProps {
  podcast: Podcast;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const publishedDate = new Date(podcast.published_at);
  const duration = podcast.duration
    ? parseYouTubeDuration(podcast.duration)
    : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-lg",
      )}
    >
      {/* YouTube Embed */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <YouTubeEmbed videoid={podcast.youtube_video_id} style="" />
      </div>

      {/* Podcast Details */}
      <div className="flex flex-1 flex-col">
        {/* Title */}
        <h3 className="mb-2 font-heading text-lg font-semibold text-gray-900 line-clamp-2">
          {podcast.title}
        </h3>

        {/* Description */}
        {podcast.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {podcast.description}
          </p>
        )}

        {/* Tags */}
        {podcast.tags && podcast.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {podcast.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-peenk-100 px-2 py-1 text-xs font-medium text-peenk-700"
              >
                #{tag}
              </span>
            ))}
            {podcast.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{podcast.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="mt-auto grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
          <div className="flex items-center gap-1">
            <Calendar className="size-3 text-grin-500" />
            <span>{formatDate(publishedDate)}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="size-3 text-grin-500" />
              <span>{duration}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="size-3 text-grin-500" />
            <span>{podcast.view_count.toLocaleString()} views</span>
          </div>
          {podcast.like_count > 0 && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="size-3 text-grin-500" />
              <span>{podcast.like_count.toLocaleString()} likes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
