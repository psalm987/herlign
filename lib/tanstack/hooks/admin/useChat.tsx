/**
 * Admin Chat Hooks
 * TanStack Query hooks for admin chat operations
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as chatActions from "@/lib/actions/chat";
import { adminChatKeys, invalidationGroups } from "@/lib/tanstack/keys";
import type {
  ChatSession,
  ChatSessionDetail,
  PaginatedResponse,
  ApiResponse,
  MutationContext,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get all chat sessions (admin)
 */
export function useAdminChatSessions(
  params?: { mode?: "auto" | "live"; page?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<PaginatedResponse<ChatSession>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PaginatedResponse<ChatSession>, Error>({
    queryKey: adminChatKeys.sessionsList(params),
    queryFn: () => chatActions.getAdminChatSessions(params),
    ...options,
  });
}

/**
 * Hook to get single chat session with messages (admin)
 */
export function useAdminChatSession(
  id: string,
  options?: Omit<
    UseQueryOptions<ChatSessionDetail, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ChatSessionDetail, Error>({
    queryKey: adminChatKeys.sessionDetail(id),
    queryFn: () => chatActions.getAdminChatSession(id),
    enabled: !!id,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to send admin message to chat session (admin)
 */
export function useSendAdminChatMessage(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      { sessionId: string; message: string },
      unknown
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    { sessionId: string; message: string },
    unknown
  >({
    ...options,
    mutationFn: ({ sessionId, message }) =>
      chatActions.sendAdminChatMessage(sessionId, message),
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
      // Invalidate the specific session to refetch messages
      queryClient.invalidateQueries({
        queryKey: adminChatKeys.sessionDetail(variables.sessionId),
      });
      // Invalidate sessions list to update last_message_at
      queryClient.invalidateQueries({
        queryKey: adminChatKeys.sessions(),
      });
    },
  });
}

/**
 * Hook to switch chat mode (admin)
 */
export function useSwitchChatMode(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ChatSession>,
      Error,
      { sessionId: string; mode: "auto" | "live" },
      unknown
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ChatSession>,
    Error,
    { sessionId: string; mode: "auto" | "live" },
    MutationContext<ChatSession>
  >({
    ...options,
    mutationFn: ({ sessionId, mode }) =>
      chatActions.switchChatMode(sessionId, mode),
    onMutate: async ({ sessionId, mode }) => {
      await queryClient.cancelQueries({
        queryKey: adminChatKeys.sessionDetail(sessionId),
      });

      const previousSession = queryClient.getQueryData<ChatSessionDetail>(
        adminChatKeys.sessionDetail(sessionId),
      );

      if (previousSession?.session) {
        queryClient.setQueryData<ChatSessionDetail>(
          adminChatKeys.sessionDetail(sessionId),
          {
            ...previousSession,
            session: {
              ...previousSession.session,
              current_mode: mode,
            },
          },
        );
      }

      return { previousData: previousSession?.session };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        const previousSession = queryClient.getQueryData<ChatSessionDetail>(
          adminChatKeys.sessionDetail(variables.sessionId),
        );
        if (previousSession) {
          queryClient.setQueryData<ChatSessionDetail>(
            adminChatKeys.sessionDetail(variables.sessionId),
            {
              ...previousSession,
              session: context.previousData,
            },
          );
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: invalidationGroups.chat.admin,
      });
    },
  });
}
