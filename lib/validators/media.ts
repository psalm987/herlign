/**
 * Validation Schemas - Media
 * 
 * Zod schemas for validating media/file upload data
 */

import { z } from 'zod';

// Allowed MIME types for uploads
export const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
] as const;

// Max file size: 5MB in bytes
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const mediaMetadataSchema = z.object({
    alt_text: z.string()
        .max(500, 'Alt text must be less than 500 characters')
        .optional()
        .nullable(),
});

export const mediaQuerySchema = z.object({
    is_used: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type MediaMetadata = z.infer<typeof mediaMetadataSchema>;
export type MediaQuery = z.infer<typeof mediaQuerySchema>;

/**
 * Validates file upload requirements
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
        return {
            valid: false,
            error: `File type must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`,
        };
    }

    return { valid: true };
}
