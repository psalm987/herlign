/**
 * Admin Media Hooks
 * TanStack Query hooks for admin media operations with optimistic updates
 */

"use client";

import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import * as mediaActions from "@/lib/actions/media";
import { mediaKeys, invalidationGroups } from "@/lib/tanstack/keys";
import type {
  Media,
  MediaUploadInput,
  MediaUploadResponse,
  PaginatedResponse,
  ApiResponse,
  MutationContext,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get all media files (admin)
 */
export function useAdminMedia(
  params?: { is_used?: boolean; page?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Media>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Media>, Error>({
    queryKey: mediaKeys.list(params),
    queryFn: () => mediaActions.getAdminMedia(params),
    ...options,
  });
}

/**
 * Hook to get all media files with infinite scroll (admin)
 */
export function useInfiniteAdminMedia(
  params?: { is_used?: boolean; limit?: number },
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<Media>, Error>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam" | "select"
  >,
) {
  return useInfiniteQuery<PaginatedResponse<Media>, Error>({
    ...options,
    queryKey: mediaKeys.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      mediaActions.getAdminMedia({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
}

/**
 * Hook to get unused media files (admin)
 */
export function useUnusedMedia(
  options?: Omit<
    UseQueryOptions<ApiResponse<Media[]>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ApiResponse<Media[]>, Error>({
    queryKey: mediaKeys.unused(),
    queryFn: mediaActions.getUnusedMedia,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to upload media file (admin)
 */
export function useUploadMedia(
  options?: Omit<
    UseMutationOptions<
      MediaUploadResponse,
      Error,
      MediaUploadInput,
      MutationContext<PaginatedResponse<Media>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    MediaUploadResponse,
    Error,
    MediaUploadInput,
    MutationContext<PaginatedResponse<Media>>
  >({
    ...options,
    mutationFn: mediaActions.uploadMedia,
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
      // Invalidate all media queries
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.media,
      });
    },
  });
}

/**
 * Hook to delete media file (admin) with optimistic updates
 */
export function useDeleteMedia(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      string,
      MutationContext<PaginatedResponse<Media>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    MutationContext<PaginatedResponse<Media>>
  >({
    ...options,
    mutationFn: mediaActions.deleteMedia,
    onMutate: async (id, context) => {
      const userContext = await options?.onMutate?.(id, context);

      await queryClient.cancelQueries({
        queryKey: mediaKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<Media>
      >({
        queryKey: mediaKeys.lists(),
      });

      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<PaginatedResponse<Media>>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((media) => media.id !== id),
            pagination: {
              ...old.pagination,
              total: old.pagination.total - 1,
            },
          };
        });
      });

      return { previousData: previousLists[0]?.[1], userContext };
    },
    onError: (err, id, result, context) => {
      options?.onError?.(err, id, result, context);

      if (result?.previousData) {
        queryClient.setQueriesData<PaginatedResponse<Media>>(
          { queryKey: mediaKeys.lists() },
          result.previousData,
        );
      }
    },
    onSettled: (data, error, id, result, context) => {
      options?.onSettled?.(data, error, id, result, context);

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.media,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}
