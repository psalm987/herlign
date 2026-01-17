/**
 * Admin Links Hooks
 * TanStack Query hooks for admin link operations with optimistic updates
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as linkActions from "@/lib/actions/links";
import { adminLinkKeys, invalidationGroups } from "@/lib/tanstack/keys";
import type {
  Link,
  LinkInput,
  LinkUpdate,
  LinkQuery,
  PaginatedResponse,
  ApiResponse,
  MutationContext,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get all links (admin)
 */
export function useAdminLinks(
  params?: LinkQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Link>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Link>, Error>({
    queryKey: adminLinkKeys.list(params),
    queryFn: () => linkActions.getAdminLinks(params),
    ...options,
  });
}

/**
 * Hook to get single link (admin)
 */
export function useAdminLink(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Link>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ApiResponse<Link>, Error>({
    queryKey: adminLinkKeys.detail(id),
    queryFn: () => linkActions.getAdminLink(id),
    enabled: !!id,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to create link (admin)
 */
export function useCreateLink(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Link>,
      Error,
      LinkInput,
      MutationContext<PaginatedResponse<Link>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Link>,
    Error,
    LinkInput,
    MutationContext<PaginatedResponse<Link>>
  >({
    ...options,
    mutationFn: linkActions.createLink,
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.links.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.links.public,
      });
    },
  });
}

/**
 * Hook to update link (admin) with optimistic updates
 */
export function useUpdateLink(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Link>,
      Error,
      { id: string; data: LinkUpdate },
      MutationContext<Link>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Link>,
    Error,
    { id: string; data: LinkUpdate },
    MutationContext<Link>
  >({
    ...options,
    mutationFn: ({ id, data }) => linkActions.updateLink(id, data),
    onMutate: async ({ id, data }, context) => {
      const userContext = await options?.onMutate?.({ id, data }, context);

      await queryClient.cancelQueries({
        queryKey: adminLinkKeys.detail(id),
      });

      const previousLink = queryClient.getQueryData<ApiResponse<Link>>(
        adminLinkKeys.detail(id),
      );

      if (previousLink?.data) {
        queryClient.setQueryData<ApiResponse<Link>>(adminLinkKeys.detail(id), {
          ...previousLink,
          data: { ...previousLink.data, ...data },
        });
      }

      return { previousData: previousLink?.data, userContext };
    },
    onError: (err, { id }, result, context) => {
      options?.onError?.(err, { id, data: {} as LinkUpdate }, result, context);

      if (result?.previousData) {
        queryClient.setQueryData<ApiResponse<Link>>(adminLinkKeys.detail(id), {
          data: result.previousData,
        });
      }
    },
    onSettled: (data, error, { id }, result, context) => {
      options?.onSettled?.(
        data,
        error,
        { id, data: {} as LinkUpdate },
        result,
        context,
      );

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.links.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.links.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to delete link (admin) with optimistic updates
 */
export function useDeleteLink(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      string,
      MutationContext<PaginatedResponse<Link>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    MutationContext<PaginatedResponse<Link>>
  >({
    ...options,
    mutationFn: linkActions.deleteLink,
    onMutate: async (id, context) => {
      const userContext = await options?.onMutate?.(id, context);

      await queryClient.cancelQueries({
        queryKey: adminLinkKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<PaginatedResponse<Link>>(
        {
          queryKey: adminLinkKeys.lists(),
        },
      );

      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<PaginatedResponse<Link>>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((link) => link.id !== id),
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
        queryClient.setQueriesData<PaginatedResponse<Link>>(
          { queryKey: adminLinkKeys.lists() },
          result.previousData,
        );
      }
    },
    onSettled: (data, error, id, result, context) => {
      options?.onSettled?.(data, error, id, result, context);

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.links.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.links.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}
