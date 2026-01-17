/**
 * Validation Schemas - Links
 * 
 * Zod schemas for validating link data
 */

import { z } from 'zod';

export const linkSchema = z.object({
    name: z.string()
        .min(1, 'Link name is required')
        .max(255, 'Link name must be less than 255 characters'),
    href: z.string()
        .url('Invalid URL format'),
    category: z.string()
        .min(1, 'Category is required')
        .max(100, 'Category must be less than 100 characters'),
});

export const linkUpdateSchema = linkSchema.partial();

export const linkQuerySchema = z.object({
    category: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type LinkInput = z.infer<typeof linkSchema>;
export type LinkUpdate = z.infer<typeof linkUpdateSchema>;
export type LinkQuery = z.infer<typeof linkQuerySchema>;
