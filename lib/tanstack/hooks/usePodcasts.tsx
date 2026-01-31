/**
 * Podcast Hooks (Public)
 *
 * TanStack Query hooks for public podcast operations
 */

"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getPodcasts } from "@/lib/actions/podcasts";
import { podcastKeys } from "@/lib/tanstack/keys";
import type { PodcastQuery } from "@/lib/validators/podcasts";
import type { Podcast } from "@/lib/actions/podcasts";
import type { PaginatedResponse } from "@/lib/tanstack/types";

/**
 * Get visible podcasts (public)
 */
export function usePodcasts(
  params?: PodcastQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Podcast>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: podcastKeys.list(params),
    queryFn: () => getPodcasts(params),
    ...options,
  });
}
