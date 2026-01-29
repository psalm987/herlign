/**
 * Authentication Hooks
 * TanStack Query hooks for authentication operations
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as authActions from "@/lib/actions/auth";
import { authKeys } from "@/lib/tanstack/keys";
import type {
  LoginCredentials,
  AuthUser,
  SessionResponse,
  ApiResponse,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get current session
 */
export function useSession(
  options?: Omit<
    UseQueryOptions<SessionResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<SessionResponse, Error>({
    queryKey: authKeys.session(),
    queryFn: authActions.getSession,
    staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    retry: false, // Don't retry session checks
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to login
 */
export function useLogin(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthUser>, Error, LoginCredentials, unknown>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AuthUser>, Error, LoginCredentials, unknown>({
    ...options,
    mutationFn: authActions.login,
    onSuccess: (data, variables, result, context) => {
      // Call user's onSuccess first
      options?.onSuccess?.(data, variables, result, context);
      // Then invalidate session query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout(
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, Error, void, unknown>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, void, unknown>({
    ...options,
    mutationFn: authActions.logout,
    onSuccess: (data, variables, result, context) => {
      // Call user's onSuccess first
      options?.onSuccess?.(data, variables, result, context);
      // Then clear all queries on logout
      queryClient.clear();
    },
  });
}

/**
 * Hook to request password reset email
 */
export function useForgotPassword(
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, Error, string, unknown>,
    "mutationFn"
  >,
) {
  return useMutation<ApiResponse<null>, Error, string, unknown>({
    ...options,
    mutationFn: authActions.forgotPassword,
  });
}

/**
 * Hook to reset password (after email link)
 */
export function useResetPassword(
  options?: Omit<
    UseMutationOptions<ApiResponse<unknown>, Error, string, unknown>,
    "mutationFn"
  >,
) {
  return useMutation<ApiResponse<unknown>, Error, string, unknown>({
    ...options,
    mutationFn: authActions.resetPassword,
  });
}

/**
 * Hook to request magic link login
 */
export function useMagicLink(
  options?: Omit<
    UseMutationOptions<void, Error, string, unknown>,
    "mutationFn"
  >,
) {
  return useMutation<void, Error, string, unknown>({
    ...options,
    mutationFn: authActions.requestMagicLink,
  });
}

/**
 * Hook to verify OTP token
 */
export function useVerifyOtp(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<unknown>,
      Error,
      {
        email: string;
        token: string;
        type?: "signup" | "magiclink" | "recovery" | "email_change";
      },
      unknown
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<unknown>,
    Error,
    {
      email: string;
      token: string;
      type?: "signup" | "magiclink" | "recovery" | "email_change";
    },
    unknown
  >({
    ...options,
    mutationFn: authActions.verifyOtp,
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
      // Invalidate session after successful OTP verification
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}
