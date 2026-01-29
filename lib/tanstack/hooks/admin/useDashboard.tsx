/**
 * Admin Dashboard Hooks
 *
 * TanStack Query hooks for dashboard statistics
 */

"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getDashboardStats, DashboardStats } from "@/lib/actions/dashboard";
import { ApiResponse } from "@/lib/tanstack/types";

/**
 * Get dashboard statistics
 */
export function useDashboardStats(
  options?: Omit<
    UseQueryOptions<ApiResponse<DashboardStats>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ApiResponse<DashboardStats>, Error>({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 1 * 60 * 1000, // 1 minute - refresh stats regularly
    ...options,
  });
}
