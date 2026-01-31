/**
 * Admin Podcast Hooks
 *
 * TanStack Query hooks for admin podcast operations with full CRUD
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getAdminPodcasts,
  getAdminPodcast,
  createPodcast,
  updatePodcast,
  deletePodcast,
  syncPodcastsFromYouTube,
} from "@/lib/actions/podcasts";
import { adminPodcastKeys, podcastKeys } from "@/lib/tanstack/keys";
import type {
  PodcastQuery,
  PodcastInput,
  PodcastUpdate,
} from "@/lib/validators/podcasts";
import type { Podcast } from "@/lib/actions/podcasts";
import type { PaginatedResponse, ApiResponse } from "@/lib/tanstack/types";

/**
 * Get all podcasts (admin)
 */
export function useAdminPodcasts(
  params?: Partial<PodcastQuery>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Podcast>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: adminPodcastKeys.list(params),
    queryFn: () => getAdminPodcasts(params),
    ...options,
  });
}

/**
 * Get single podcast by ID (admin)
 */
export function useAdminPodcast(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Podcast>>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: adminPodcastKeys.detail(id),
    queryFn: () => getAdminPodcast(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create podcast (admin)
 */
export function useCreatePodcast(
  options?: Omit<
    UseMutationOptions<ApiResponse<Podcast>, Error, PodcastInput>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createPodcast,
    onSuccess: (data, variables, onMutationResult, context) => {
      options?.onSuccess?.(data, variables, onMutationResult, context);
      // Invalidate podcast lists
      queryClient.invalidateQueries({ queryKey: adminPodcastKeys.lists() });
      queryClient.invalidateQueries({ queryKey: podcastKeys.lists() });
    },
  });
}

/**
 * Update podcast (admin)
 */
export function useUpdatePodcast(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Podcast>,
      Error,
      { id: string; data: PodcastUpdate }
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => updatePodcast(id, data),
    onSuccess: (data, variables, onMutationResult, context) => {
      options?.onSuccess?.(data, variables, onMutationResult, context);
      // Invalidate specific podcast and lists
      queryClient.invalidateQueries({
        queryKey: adminPodcastKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: adminPodcastKeys.lists() });
      queryClient.invalidateQueries({ queryKey: podcastKeys.lists() });
    },
  });
}

/**
 * Delete podcast (admin)
 */
export function useDeletePodcast(
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, Error, string>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deletePodcast,
    onSuccess: (data, variables, onMutationResult, context) => {
      options?.onSuccess?.(data, variables, onMutationResult, context);
      // Invalidate podcast lists
      queryClient.invalidateQueries({ queryKey: adminPodcastKeys.lists() });
      queryClient.invalidateQueries({ queryKey: podcastKeys.lists() });
    },
  });
}

/**
 * Sync podcasts from YouTube (admin)
 */
export function useSyncPodcasts(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ added: number; updated: number; removed: number }>,
      Error,
      void
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: syncPodcastsFromYouTube,
    onSuccess: (data, variables, onMutationResult, context) => {
      options?.onSuccess?.(data, variables, onMutationResult, context);
      // Invalidate all podcast queries
      queryClient.invalidateQueries({ queryKey: adminPodcastKeys.all });
      queryClient.invalidateQueries({ queryKey: podcastKeys.all });
    },
  });
}
