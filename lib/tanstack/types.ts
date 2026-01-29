/**
 * Shared TypeScript types for API responses
 * Based on API responses and Zod validator inference
 */

import type { z } from 'zod';
import type {
    eventSchema,
    eventUpdateSchema,
    eventQuerySchema,
} from '@/lib/validators/events';
import type {
    resourceSchema,
    resourceUpdateSchema,
    resourceQuerySchema,
} from '@/lib/validators/resources';
import type {
    testimonialSchema,
    testimonialUpdateSchema,
    testimonialQuerySchema,
} from '@/lib/validators/testimonials';
import type {
    linkSchema,
    linkUpdateSchema,
    linkQuerySchema,
} from '@/lib/validators/links';
import type {
    chatMessageSchema,
} from '@/lib/validators/chat';
import type { Database } from '@/lib/supabase/database.types';

// =====================================================
// API Response Wrapper Types
// =====================================================

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
    details?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext?: boolean;
    };
    filters?: Record<string, string>;
    message?: string;
}

// =====================================================
// Entity Types (inferred from Zod & Database)
// =====================================================

// Events
export type EventInput = z.infer<typeof eventSchema>;
export type EventUpdate = z.infer<typeof eventUpdateSchema>;
export type EventQuery = z.infer<typeof eventQuerySchema>;
export type Event = Database['public']['Tables']['events']['Row'];

// Resources
export type ResourceInput = z.infer<typeof resourceSchema>;
export type ResourceUpdate = z.infer<typeof resourceUpdateSchema>;
export type ResourceQuery = z.infer<typeof resourceQuerySchema>;
export type Resource = Database['public']['Tables']['resources']['Row'];

// Testimonials
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type TestimonialUpdate = z.infer<typeof testimonialUpdateSchema>;
export type TestimonialQuery = z.infer<typeof testimonialQuerySchema>;
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];

// Links
export type LinkInput = z.infer<typeof linkSchema>;
export type LinkUpdate = z.infer<typeof linkUpdateSchema>;
export type LinkQuery = z.infer<typeof linkQuerySchema>;
export type Link = Database['public']['Tables']['links']['Row'];

// Media
export type Media = Database['public']['Tables']['media']['Row'];
export interface MediaUploadInput {
    file: File;
    alt_text?: string;
}

export interface StorageQuota {
    used: number;
    limit: number;
    percentUsed: number;
    alertThreshold: boolean;
}

export interface MediaUploadResponse {
    data: Media;
    message: string;
    quota: {
        used: number;
        percentUsed: number;
    };
}

// Chat
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
export type ChatResponse = ChatMessage

export interface ChatHistoryResponse {
    sessionId: string;
    mode: 'auto' | 'live';
    messages: Array<{
        id: string;
        sender: 'guest' | 'admin' | 'bot';
        content: string;
        timestamp: string;
    }>;
}

export interface ChatSessionDetail {
    session: ChatSession;
    messages: Array<{
        id: string;
        sender: 'guest' | 'admin' | 'bot';
        content: string;
        timestamp: string;
    }>;
}

// =====================================================
// Authentication Types
// =====================================================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
}

export interface SessionResponse {
    authenticated: boolean;
    user: AuthUser | null;
}

// =====================================================
// Query/Mutation Options Types
// =====================================================

export interface QueryOptions {
    page?: number;
    limit?: number;
    [key: string]: unknown;
}

export interface MutationContext<T = unknown> {
    previousData?: T;
}

// =====================================================
// Rate Limit Types
// =====================================================

export interface RateLimitError {
    error: string;
    resetIn: number;
}

// =====================================================
// Generic API Error Type
// =====================================================

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}
