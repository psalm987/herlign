/**
 * Chat Hooks (Public)
 * TanStack Query hooks for public chat operations
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as chatActions from "@/lib/actions/chat";
import { chatKeys } from "@/lib/tanstack/keys";
import type {
  ChatMessageInput,
  ChatResponse,
  ChatHistoryResponse,
  ApiResponse,
} from "@/lib/tanstack/types";

// =====================================================
// Query Hooks
// =====================================================

/**
 * Hook to get chat history (guest)
 */
export function useChatHistory(
  options?: Omit<
    UseQueryOptions<ChatHistoryResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ChatHistoryResponse, Error>({
    queryKey: chatKeys.history(),
    queryFn: chatActions.getChatHistory,
    ...options,
  });
}

// =====================================================
// Mutation Hooks
// =====================================================

/**
 * Hook to send chat message (guest)
 */
export function useSendChatMessage(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ChatResponse>,
      Error,
      ChatMessageInput,
      unknown
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ChatResponse>,
    Error,
    ChatMessageInput,
    unknown
  >({
    ...options,
    mutationFn: chatActions.sendChatMessage,
    onSuccess: (data, variables, result, context) => {
      options?.onSuccess?.(data, variables, result, context);
      queryClient.invalidateQueries({ queryKey: chatKeys.history() });
    },
  });
}
