/**
 * Admin Resources Hooks
 * TanStack Query hooks for admin resource operations with optimistic updates
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as resourceActions from "@/lib/actions/resources";
import { adminResourceKeys, invalidationGroups } from "@/lib/tanstack/keys";
import type {
  Resource,
  ResourceInput,
  ResourceUpdate,
  ResourceQuery,
  PaginatedResponse,
  ApiResponse,
  MutationContext,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get all resources (admin)
 */
export function useAdminResources(
  params?: ResourceQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Resource>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Resource>, Error>({
    queryKey: adminResourceKeys.list(params),
    queryFn: () => resourceActions.getAdminResources(params),
    ...options,
  });
}

/**
 * Hook to get single resource (admin)
 */
export function useAdminResource(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Resource>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ApiResponse<Resource>, Error>({
    queryKey: adminResourceKeys.detail(id),
    queryFn: () => resourceActions.getAdminResource(id),
    enabled: !!id,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to create resource (admin)
 */
export function useCreateResource(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Resource>,
      Error,
      ResourceInput,
      MutationContext<PaginatedResponse<Resource>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Resource>,
    Error,
    ResourceInput,
    MutationContext<PaginatedResponse<Resource>>
  >({
    ...options,
    mutationFn: resourceActions.createResource,
    onSuccess: (data, variables, result, context) => {
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.resources.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.resources.public,
      });
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to update resource (admin) with optimistic updates
 */
export function useUpdateResource(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Resource>,
      Error,
      { id: string; data: ResourceUpdate },
      MutationContext<Resource>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Resource>,
    Error,
    { id: string; data: ResourceUpdate },
    MutationContext<Resource>
  >({
    ...options,
    mutationFn: ({ id, data }) => resourceActions.updateResource(id, data),
    onMutate: async ({ id, data }, context) => {
      const userContext = await options?.onMutate?.({ id, data }, context);

      await queryClient.cancelQueries({
        queryKey: adminResourceKeys.detail(id),
      });

      const previousResource = queryClient.getQueryData<ApiResponse<Resource>>(
        adminResourceKeys.detail(id),
      );

      if (previousResource?.data) {
        queryClient.setQueryData<ApiResponse<Resource>>(
          adminResourceKeys.detail(id),
          {
            ...previousResource,
            data: { ...previousResource.data, ...data },
          },
        );
      }

      return { previousData: previousResource?.data, userContext };
    },
    onError: (err, { id }, result, context) => {
      options?.onError?.(
        err,
        { id, data: {} as ResourceUpdate },
        result,
        context,
      );

      if (result?.previousData) {
        queryClient.setQueryData<ApiResponse<Resource>>(
          adminResourceKeys.detail(id),
          { data: result.previousData },
        );
      }
    },
    onSettled: (data, error, { id }, result, context) => {
      options?.onSettled?.(
        data,
        error,
        { id, data: {} as ResourceUpdate },
        result,
        context,
      );

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.resources.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.resources.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to delete resource (admin) with optimistic updates
 */
export function useDeleteResource(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      string,
      MutationContext<PaginatedResponse<Resource>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    MutationContext<PaginatedResponse<Resource>>
  >({
    ...options,
    mutationFn: resourceActions.deleteResource,
    onMutate: async (id, context) => {
      const userContext = await options?.onMutate?.(id, context);

      await queryClient.cancelQueries({
        queryKey: adminResourceKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<Resource>
      >({
        queryKey: adminResourceKeys.lists(),
      });

      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<PaginatedResponse<Resource>>(
          queryKey,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.filter((resource) => resource.id !== id),
              pagination: {
                ...old.pagination,
                total: old.pagination.total - 1,
              },
            };
          },
        );
      });

      return { previousData: previousLists[0]?.[1], userContext };
    },
    onError: (err, id, result, context) => {
      options?.onError?.(err, id, result, context);

      if (result?.previousData) {
        queryClient.setQueriesData<PaginatedResponse<Resource>>(
          { queryKey: adminResourceKeys.lists() },
          result.previousData,
        );
      }
    },
    onSettled: (data, error, id, result, context) => {
      options?.onSettled?.(data, error, id, result, context);

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.resources.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.resources.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}
