/**
 * Admin Events Hooks
 * TanStack Query hooks for admin event operations with optimistic updates
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as eventActions from "@/lib/actions/events";
import { adminEventKeys, invalidationGroups } from "@/lib/tanstack/keys";
import type {
  Event,
  EventInput,
  EventUpdate,
  EventQuery,
  PaginatedResponse,
  ApiResponse,
  MutationContext,
} from "@/lib/tanstack/types";
import { toLocalOffsetString } from "@/lib/utils/date";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get all events (admin)
 */
export function useAdminEvents(
  params?: EventQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Event>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Event>, Error>({
    queryKey: adminEventKeys.list(params),
    queryFn: () => eventActions.getAdminEvents(params),
    ...options,
  });
}

/**
 * Hook to get single event (admin)
 */
export function useAdminEvent(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Event>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ApiResponse<Event>, Error>({
    queryKey: adminEventKeys.detail(id),
    queryFn: () => eventActions.getAdminEvent(id),
    enabled: !!id,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to create event (admin)
 */
export function useCreateEvent(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Event>,
      Error,
      EventInput,
      MutationContext<PaginatedResponse<Event>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Event>,
    Error,
    EventInput,
    MutationContext<PaginatedResponse<Event>>
  >({
    ...options,
    mutationFn: eventActions.createEvent,
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.events.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.events.public,
      });
      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to update event (admin) with optimistic updates
 */
export function useUpdateEvent(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Event>,
      Error,
      { id: string; data: EventUpdate },
      MutationContext<Event>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Event>,
    Error,
    { id: string; data: EventUpdate },
    MutationContext<Event>
  >({
    ...options,
    mutationFn: ({ id, data }) => eventActions.updateEvent(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      if (data?.start_date)
        data.start_date = toLocalOffsetString(data.start_date);
      if (data?.end_date) data.end_date = toLocalOffsetString(data.end_date);
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: adminEventKeys.detail(id),
      });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData<ApiResponse<Event>>(
        adminEventKeys.detail(id),
      );

      // Optimistically update the cache
      if (previousEvent?.data) {
        queryClient.setQueryData<ApiResponse<Event>>(
          adminEventKeys.detail(id),
          {
            ...previousEvent,
            data: { ...previousEvent.data, ...data },
          },
        );
      }

      return { previousData: previousEvent?.data };
    },
    // Rollback on error
    onError: (err, { id }, result, context) => {
      if (result?.previousData) {
        queryClient.setQueryData<ApiResponse<Event>>(
          adminEventKeys.detail(id),
          { data: result.previousData },
        );
      }
      options?.onError?.(err, { id, data: {} as EventUpdate }, result, context);
    },
    // Always refetch after error or success
    onSettled: (data, error, { id }, result, context) => {
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.events.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.events.public,
      });
      options?.onSettled?.(
        data,
        error,
        { id, data: {} as EventUpdate },
        result,
        context,
      );
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to delete event (admin) with optimistic updates
 */
export function useDeleteEvent(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      string,
      MutationContext<PaginatedResponse<Event>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    MutationContext<PaginatedResponse<Event>>
  >({
    ...options,
    mutationFn: eventActions.deleteEvent,
    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: adminEventKeys.lists(),
      });

      // Snapshot previous value
      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<Event>
      >({
        queryKey: adminEventKeys.lists(),
      });

      // Optimistically remove from all list queries
      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<PaginatedResponse<Event>>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((event) => event.id !== id),
            pagination: {
              ...old.pagination,
              total: old.pagination.total - 1,
            },
          };
        });
      });

      return { previousData: previousLists[0]?.[1] };
    },
    // Rollback on error
    onError: (err, id, result, context) => {
      if (result?.previousData) {
        queryClient.setQueriesData<PaginatedResponse<Event>>(
          { queryKey: adminEventKeys.lists() },
          result.previousData,
        );
      }
      options?.onError?.(err, id, result, context);
    },
    // Always refetch after error or success
    onSettled: (data, error, id, result, context) => {
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.events.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.events.public,
      });
      options?.onSettled?.(data, error, id, result, context);
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}
