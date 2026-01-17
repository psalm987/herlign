/**
 * Validation Schemas - Testimonials
 * 
 * Zod schemas for validating testimonial data
 */

import { z } from 'zod';

export const testimonialSchema = z.object({
    rating: z.number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5')
        .optional()
        .nullable(),
    avatar_url: z.string()
        .url('Invalid avatar URL format')
        .optional()
        .nullable(),
    review: z.string()
        .min(10, 'Review must be at least 10 characters')
        .max(2000, 'Review must be less than 2000 characters'),
    reviewer_name: z.string()
        .min(1, 'Reviewer name is required')
        .max(255, 'Reviewer name must be less than 255 characters'),
    reviewer_title: z.string()
        .max(255, 'Reviewer title must be less than 255 characters')
        .optional()
        .nullable(),
    is_approved: z.boolean()
        .default(false),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const testimonialQuerySchema = z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    is_approved: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type TestimonialUpdate = z.infer<typeof testimonialUpdateSchema>;
export type TestimonialQuery = z.infer<typeof testimonialQuerySchema>;
