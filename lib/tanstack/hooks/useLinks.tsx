/**
 * Links Hooks (Public)
 * TanStack Query hooks for public link operations
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import * as linkActions from "@/lib/actions/links";
import { linkKeys } from "@/lib/tanstack/keys";
import type { Link, LinkQuery, PaginatedResponse } from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get links (public)
 */
export function useLinks(
  params?: LinkQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Link>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Link>, Error>({
    queryKey: linkKeys.list(params),
    queryFn: () => linkActions.getLinks(params),
    ...options,
  });
}
