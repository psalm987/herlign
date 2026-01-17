/**
 * Loading States for Events Page
 * Skeleton loaders for carousel and event cards
 */

import React from "react";
// import { cn } from "@/lib/utils";

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 md:flex-row md:gap-6">
      {/* Image Skeleton */}
      <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200 md:h-auto md:w-64 shrink-0" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Badges */}
          <div className="mb-3 flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Title */}
          <div className="mb-2 h-7 w-3/4 animate-pulse rounded bg-gray-200" />

          {/* Description */}
          <div className="mb-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Meta Info */}
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-4">
          <div className="h-9 w-32 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export const FeaturedCarouselSkeleton: React.FC = () => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-gray-200">
      <div className="flex h-full items-end p-8">
        <div className="w-full max-w-2xl space-y-4">
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-300" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-300" />
          </div>

          {/* Title */}
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-300" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-300" />
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-300" />
          </div>

          {/* Button */}
          <div className="h-10 w-40 animate-pulse rounded-md bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

interface LoadingGridProps {
  count?: number;
}

export const LoadingEventsGrid: React.FC<LoadingGridProps> = ({
  count = 5,
}) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
};
