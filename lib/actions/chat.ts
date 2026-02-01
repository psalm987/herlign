/**
 * Chat Actions
 * Handles all chat-related API calls (public and admin)
 */

import { api } from '@/lib/services/api';
import type {
    ChatMessageInput,
    ChatResponse,
    ChatHistoryResponse,
    ChatSession,
    ChatSessionDetail,
    PaginatedResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

// =====================================================
// Public Actions
// =====================================================

/**
 * Send chat message (guest)
 */
export async function sendChatMessage(
    input: ChatMessageInput
): Promise<ApiResponse<ChatResponse>> {
    return api.post<ApiResponse<ChatResponse>>('/api/chat/message', input);
}

/**
 * Get chat history (guest)
 */
export async function getChatHistory(): Promise<ChatHistoryResponse> {
    return api.get<ChatHistoryResponse>('/api/chat/history');
}

// =====================================================
// Admin Actions
// =====================================================

/**
 * Get all chat sessions (admin)
 */
export async function getAdminChatSessions(params?: {
    mode?: 'auto' | 'live';
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<ChatSession>> {
    return api.get<PaginatedResponse<ChatSession>>(
        '/api/admin/chat/sessions',
        params
    );
}

/**
 * Get single chat session with messages (admin)
 */
export async function getAdminChatSession(
    id: string
): Promise<ChatSessionDetail> {
    const response = await api.get<ApiResponse<ChatSessionDetail>>(`/api/admin/chat/sessions/${id}`);
    return response.data!;
}

/**
 * Send admin response to chat session (admin)
 */
export async function sendAdminChatMessage(
    sessionId: string,
    message: string
): Promise<ApiResponse<null>> {
    return api.post<ApiResponse<null>>(`/api/admin/chat/sessions/${sessionId}`, {
        message,
    });
}

/**
 * Switch chat mode (admin)
 */
export async function switchChatMode(
    sessionId: string,
    mode: 'auto' | 'live'
): Promise<ApiResponse<ChatSession>> {
    return api.post<ApiResponse<ChatSession>>(
        `/api/admin/chat/sessions/${sessionId}/mode`,
        { mode }
    );
}
