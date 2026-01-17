/**
 * Admin Testimonials Hooks
 * TanStack Query hooks for admin testimonial operations with optimistic updates
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as testimonialActions from "@/lib/actions/testimonials";
import { adminTestimonialKeys, invalidationGroups } from "@/lib/tanstack/keys";
import type {
  Testimonial,
  TestimonialInput,
  TestimonialUpdate,
  TestimonialQuery,
  PaginatedResponse,
  ApiResponse,
  MutationContext,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get all testimonials (admin)
 */
export function useAdminTestimonials(
  params?: TestimonialQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Testimonial>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Testimonial>, Error>({
    queryKey: adminTestimonialKeys.list(params),
    queryFn: () => testimonialActions.getAdminTestimonials(params),
    ...options,
  });
}

/**
 * Hook to get single testimonial (admin)
 */
export function useAdminTestimonial(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Testimonial>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ApiResponse<Testimonial>, Error>({
    queryKey: adminTestimonialKeys.detail(id),
    queryFn: () => testimonialActions.getAdminTestimonial(id),
    enabled: !!id,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to create testimonial (admin)
 */
export function useCreateTestimonial(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Testimonial>,
      Error,
      TestimonialInput,
      MutationContext<PaginatedResponse<Testimonial>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Testimonial>,
    Error,
    TestimonialInput,
    MutationContext<PaginatedResponse<Testimonial>>
  >({
    ...options,
    mutationFn: testimonialActions.createTestimonial,
    onSuccess: (data, variables, result, context) => {
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.public,
      });
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to update testimonial (admin) with optimistic updates
 */
export function useUpdateTestimonial(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Testimonial>,
      Error,
      { id: string; data: TestimonialUpdate },
      MutationContext<Testimonial>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Testimonial>,
    Error,
    { id: string; data: TestimonialUpdate },
    MutationContext<Testimonial>
  >({
    ...options,
    mutationFn: ({ id, data }) =>
      testimonialActions.updateTestimonial(id, data),
    onMutate: async ({ id, data }, context) => {
      const userContext = await options?.onMutate?.({ id, data }, context);

      await queryClient.cancelQueries({
        queryKey: adminTestimonialKeys.detail(id),
      });

      const previousTestimonial = queryClient.getQueryData<
        ApiResponse<Testimonial>
      >(adminTestimonialKeys.detail(id));

      if (previousTestimonial?.data) {
        queryClient.setQueryData<ApiResponse<Testimonial>>(
          adminTestimonialKeys.detail(id),
          {
            ...previousTestimonial,
            data: { ...previousTestimonial.data, ...data },
          },
        );
      }

      return { previousData: previousTestimonial?.data, userContext };
    },
    onError: (err, { id }, result, context) => {
      options?.onError?.(
        err,
        { id, data: {} as TestimonialUpdate },
        result,
        context,
      );

      if (result?.previousData) {
        queryClient.setQueryData<ApiResponse<Testimonial>>(
          adminTestimonialKeys.detail(id),
          { data: result.previousData },
        );
      }
    },
    onSettled: (data, error, { id }, result, context) => {
      options?.onSettled?.(
        data,
        error,
        { id, data: {} as TestimonialUpdate },
        result,
        context,
      );

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to delete testimonial (admin) with optimistic updates
 */
export function useDeleteTestimonial(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      string,
      MutationContext<PaginatedResponse<Testimonial>>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    MutationContext<PaginatedResponse<Testimonial>>
  >({
    ...options,
    mutationFn: testimonialActions.deleteTestimonial,
    onMutate: async (id, context) => {
      const userContext = await options?.onMutate?.(id, context);

      await queryClient.cancelQueries({
        queryKey: adminTestimonialKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<Testimonial>
      >({
        queryKey: adminTestimonialKeys.lists(),
      });

      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<PaginatedResponse<Testimonial>>(
          queryKey,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.filter((testimonial) => testimonial.id !== id),
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
        queryClient.setQueriesData<PaginatedResponse<Testimonial>>(
          { queryKey: adminTestimonialKeys.lists() },
          result.previousData,
        );
      }
    },
    onSettled: (data, error, id, result, context) => {
      options?.onSettled?.(data, error, id, result, context);

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}

/**
 * Hook to approve testimonial (admin)
 */
export function useApproveTestimonial(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Testimonial>,
      Error,
      string,
      MutationContext<Testimonial>
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Testimonial>,
    Error,
    string,
    MutationContext<Testimonial>
  >({
    ...options,
    mutationFn: testimonialActions.approveTestimonial,
    onMutate: async (id, context) => {
      const userContext = await options?.onMutate?.(id, context);

      await queryClient.cancelQueries({
        queryKey: adminTestimonialKeys.detail(id),
      });

      const previousTestimonial = queryClient.getQueryData<
        ApiResponse<Testimonial>
      >(adminTestimonialKeys.detail(id));

      if (previousTestimonial?.data) {
        queryClient.setQueryData<ApiResponse<Testimonial>>(
          adminTestimonialKeys.detail(id),
          {
            ...previousTestimonial,
            data: { ...previousTestimonial.data, is_approved: true },
          },
        );
      }

      return { previousData: previousTestimonial?.data, userContext };
    },
    onError: (err, id, result, context) => {
      options?.onError?.(err, id, result, context);

      if (result?.previousData) {
        queryClient.setQueryData<ApiResponse<Testimonial>>(
          adminTestimonialKeys.detail(id),
          { data: result.previousData },
        );
      }
    },
    onSettled: (data, error, id, result, context) => {
      options?.onSettled?.(data, error, id, result, context);

      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.admin,
      });
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.testimonials.public,
      });
    },
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
    },
  });
}
