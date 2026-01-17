/**
 * Resources Hooks (Public)
 * TanStack Query hooks for public resource operations
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import * as resourceActions from "@/lib/actions/resources";
import { resourceKeys } from "@/lib/tanstack/keys";
import type {
  Resource,
  ResourceQuery,
  PaginatedResponse,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get resources (public)
 */
export function useResources(
  params?: ResourceQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Resource>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Resource>, Error>({
    queryKey: resourceKeys.list(params),
    queryFn: () => resourceActions.getResources(params),
    ...options,
  });
}
