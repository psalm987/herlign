/**
 * Loading States for Resources
 * Skeleton loaders for resources grid
 */

import React from "react";

export const LoadingResourcesGrid: React.FC = () => {
  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Skeleton Results Count */}
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-gray-200" />

        {/* Skeleton Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <ResourceCardSkeleton key={idx} />
          ))}
        </div>

        {/* Skeleton Pagination */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-10 w-10 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </section>
  );
};

const ResourceCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6">
      {/* Format Badge and Price */}
      <div className="mb-3 flex items-center justify-between">
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
        <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Category */}
      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />

      {/* Title */}
      <div className="mb-3 space-y-2">
        <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Description */}
      <div className="mb-4 grow space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Tags */}
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200" />
        <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Button */}
      <div className="mt-auto h-10 w-full animate-pulse rounded bg-gray-200" />
    </div>
  );
};
