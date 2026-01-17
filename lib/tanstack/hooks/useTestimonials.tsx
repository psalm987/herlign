/**
 * Testimonials Hooks (Public)
 * TanStack Query hooks for public testimonial operations
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import * as testimonialActions from "@/lib/actions/testimonials";
import { testimonialKeys } from "@/lib/tanstack/keys";
import type {
  Testimonial,
  TestimonialQuery,
  PaginatedResponse,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get approved testimonials (public)
 */
export function useTestimonials(
  params?: TestimonialQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Testimonial>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Testimonial>, Error>({
    queryKey: testimonialKeys.list(params),
    queryFn: () => testimonialActions.getTestimonials(params),
    ...options,
  });
}
