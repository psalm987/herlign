/**
 * Validation Schemas - Resources
 * 
 * Zod schemas for validating resource data
 */

import { z } from 'zod';

export const resourceSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters'),
    external_link: z.string()
        .url('Invalid URL format'),
    format: z.enum(['ebook', 'guide', 'template'], {
        required_error: 'Resource format is required',
        invalid_type_error: 'Format must be "ebook", "guide", or "template"',
    }),
    category: z.string()
        .min(1, 'Category is required')
        .max(100, 'Category must be less than 100 characters'),
    tags: z.array(z.string().max(50))
        .default([])
        .optional(),
    price: z.number()
        .nonnegative('Price must be non-negative')
        .default(0),
    is_paid: z.boolean()
        .default(false),
});

export const resourceUpdateSchema = resourceSchema.partial();

export const resourceQuerySchema = z.object({
    format: z.enum(['ebook', 'guide', 'template']).optional(),
    category: z.string().optional(),
    tags: z.string().optional(), // Comma-separated tags
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
export type ResourceUpdate = z.infer<typeof resourceUpdateSchema>;
export type ResourceQuery = z.infer<typeof resourceQuerySchema>;
