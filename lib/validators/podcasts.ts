/**
 * Podcast Validators
 * 
 * Zod schemas for podcast data validation
 */

import { z } from 'zod';

/**
 * Base podcast schema
 */
export const podcastSchema = z.object({
    youtube_video_id: z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'Invalid YouTube video ID'),
    title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
    description: z.string().optional().nullable(),
    thumbnail_url: z.string().url('Invalid thumbnail URL').optional().nullable(),
    published_at: z.string().datetime('Invalid published date'),
    duration: z.string().optional().nullable(),
    view_count: z.number().int().min(0).default(0),
    like_count: z.number().int().min(0).default(0),
    comment_count: z.number().int().min(0).default(0),
    channel_title: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    category_id: z.string().optional().nullable(),
    is_visible: z.boolean().default(true),
});

/**
 * Podcast creation schema (admin)
 */
export const podcastCreateSchema = podcastSchema;

/**
 * Podcast update schema (admin)
 */
export const podcastUpdateSchema = podcastSchema.partial().extend({
    is_visible: z.boolean().optional(),
});

/**
 * Podcast query parameters schema
 */
export const podcastQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    tags: z.string().optional(), // Comma-separated tags
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    sortBy: z.enum(['published_at', 'view_count', 'like_count', 'created_at']).default('published_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    is_visible: z.coerce.boolean().optional(),
}).optional();

/**
 * YouTube video data schema (from API)
 */
export const youtubeVideoSchema = z.object({
    id: z.string(),
    snippet: z.object({
        title: z.string(),
        description: z.string(),
        publishedAt: z.string(),
        thumbnails: z.object({
            high: z.object({
                url: z.string(),
            }).optional(),
            medium: z.object({
                url: z.string(),
            }).optional(),
            default: z.object({
                url: z.string(),
            }).optional(),
        }),
        channelTitle: z.string().optional(),
        tags: z.array(z.string()).optional(),
        categoryId: z.string().optional(),
    }),
    contentDetails: z.object({
        duration: z.string(),
    }).optional(),
    statistics: z.object({
        viewCount: z.string().optional(),
        likeCount: z.string().optional(),
        commentCount: z.string().optional(),
    }).optional(),
});

/**
 * TypeScript types
 */
export type PodcastInput = z.infer<typeof podcastSchema>;
export type PodcastUpdate = z.infer<typeof podcastUpdateSchema>;
export type PodcastQuery = Partial<z.infer<typeof podcastQuerySchema>>;
export type YouTubeVideo = z.infer<typeof youtubeVideoSchema>;
