/**
 * Events Hooks (Public)
 * TanStack Query hooks for public event operations
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import * as eventActions from "@/lib/actions/events";
import { eventKeys } from "@/lib/tanstack/keys";
import type {
  Event,
  EventQuery,
  PaginatedResponse,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get published events (public)
 */
export function useEvents(
  params?: EventQuery,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Event>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<Event>, Error>({
    queryKey: eventKeys.list(params),
    queryFn: () => eventActions.getEvents(params),
    ...options,
  });
}
