/**
 * Validation Schemas - Chat
 * 
 * Zod schemas for validating chat-related data
 */

import { z } from 'zod';

export const chatMessageSchema = z.object({
    message: z.string()
        .min(1, 'Message cannot be empty')
        .max(2000, 'Message must be less than 2000 characters'),
});

export const chatModeSchema = z.object({
    mode: z.enum(['auto', 'live'], {
        required_error: 'Chat mode is required',
        invalid_type_error: 'Mode must be either "auto" or "live"',
    }),
});

export const chatSessionQuerySchema = z.object({
    mode: z.enum(['auto', 'live']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatModeInput = z.infer<typeof chatModeSchema>;
export type ChatSessionQuery = z.infer<typeof chatSessionQuerySchema>;
