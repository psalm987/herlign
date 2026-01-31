/**
 * Podcasts Page - Public
 * Browse and filter podcast videos from YouTube
 */

"use client";

import React, { useState } from "react";
import {
  Search,
  // Filter, Calendar, TrendingUp,
  Clock,
} from "lucide-react";
import { usePodcasts } from "@/lib/tanstack/hooks/usePodcasts";
import { PodcastCard } from "@/components/sections/podcasts/podcast-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { Skeleton } from "@/components/ui/skeleton";

export default function PodcastsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "published_at" | "view_count" | "like_count"
  >("published_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = usePodcasts({
    page,
    limit: 12,
    search: search || undefined,
    sortBy,
    sortOrder,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as typeof sortBy);
    setPage(1);
  };

  const handleOrderChange = (value: string) => {
    setSortOrder(value as typeof sortOrder);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-peenk-500 to-perple-600 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl">
              Herlign Voices
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg md:text-xl">
              Get your daily dose of inspiration from women who are building
              stuff. Watch honest conversations and stories from ambitious
              women.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="border-b bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search podcasts..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex flex-wrap gap-3">
              <CustomSelect
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                options={[
                  {
                    value: "published_at",
                    label: "Latest",
                    // icon: <Calendar className="size-4" />,
                  },
                  {
                    value: "view_count",
                    label: "Most Viewed",
                    // icon: <TrendingUp className="size-4" />,
                  },
                  {
                    value: "like_count",
                    label: "Most Liked",
                    // icon: <TrendingUp className="size-4" />,
                  },
                ]}
                placeholder="Sort by"
                className="w-40"
              />

              <CustomSelect
                value={sortOrder}
                onChange={(e) => handleOrderChange(e.target.value)}
                options={[
                  {
                    value: "desc",
                    label: "Descending",
                    // icon: <Filter className="size-4" />,
                  },
                  {
                    value: "asc",
                    label: "Ascending",
                    // icon: <Filter className="size-4" />,
                  },
                ]}
                placeholder="Order"
                className="w-36"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Podcasts Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <p className="text-red-600">
                Failed to load podcasts. Please try again later.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Podcasts */}
          {data && data.data.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {data.data.length} of {data.pagination.total} podcasts
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.pagination.hasNext}
                    className="bg-grin-600 hover:bg-grin-700"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {data && data.data.length === 0 && (
            <div className="rounded-lg bg-gray-100 p-12 text-center">
              <Clock className="mx-auto size-16 text-gray-400" />
              <h3 className="mt-4 font-heading text-xl font-semibold text-gray-900">
                No podcasts found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
