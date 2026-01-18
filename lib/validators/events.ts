/**
 * Validation Schemas - Events
 * 
 * Zod schemas for validating event/workshop data
 */

import { z } from 'zod';

const baseEventSchema = z.object({
    type: z.enum(['event', 'workshop'], {
        required_error: 'Event type is required',
        invalid_type_error: 'Event type must be either "event" or "workshop"',
    }),
    mode: z.enum(['live', 'online'], {
        required_error: 'Event mode is required',
        invalid_type_error: 'Event mode must be either "live" or "online"',
    }),
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    slug: z.string()
        .min(6, 'Slug must be at least 6 characters')
        .max(20, 'Slug must be less than 20 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
        .optional(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters'),
    external_link: z.string()
        .url('Invalid URL format')
        .optional()
        .nullable(),
    start_date: z.string()
        .datetime('Invalid start date format'),
    end_date: z.string()
        .datetime('Invalid end date format'),
    max_attendees: z.number()
        .int('Max attendees must be an integer')
        .positive('Max attendees must be positive')
        .optional()
        .nullable(),
    image_url: z.string()
        .url('Invalid image URL format')
        .optional()
        .nullable(),
    price: z.number()
        .nonnegative('Price must be non-negative')
        .default(0),
    is_paid: z.boolean()
        .default(false),
    status: z.enum(['draft', 'published', 'cancelled'])
        .default('draft'),
    featured: z.boolean()
        .default(false),
});

export const eventSchema = baseEventSchema.refine(
    (data) => new Date(data.end_date) >= new Date(data.start_date),
    {
        message: 'End date must be after or equal to start date',
        path: ['end_date'],
    }
);

export const eventUpdateSchema = baseEventSchema.partial();

export const eventQuerySchema = z.object({
    type: z.enum(['event', 'workshop']).optional(),
    mode: z.enum(['live', 'online']).optional(),
    status: z.enum(['draft', 'published', 'cancelled']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().max(255).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    featured: z.coerce.boolean().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
export type EventUpdate = z.infer<typeof eventUpdateSchema>;
export type EventQuery = z.infer<typeof eventQuerySchema>;
