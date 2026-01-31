/**
 * Podcast Actions
 * 
 * API action functions for podcast operations
 */

import { api } from '@/lib/services/api';
import type { PaginatedResponse, ApiResponse } from '@/lib/tanstack/types';
import type { PodcastQuery, PodcastInput, PodcastUpdate } from '@/lib/validators/podcasts';

/**
 * Podcast type (matches database schema)
 */
export interface Podcast {
    id: string;
    youtube_video_id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    published_at: string;
    duration: string | null;
    view_count: number;
    like_count: number;
    comment_count: number;
    channel_title: string | null;
    tags: string[];
    category_id: string | null;
    is_visible: boolean;
    admin_id: string | null;
    created_at: string;
    updated_at: string;
}

// =====================================================
// PUBLIC ACTIONS
// =====================================================

/**
 * Get visible podcasts (public)
 */
export async function getPodcasts(params?: PodcastQuery) {
    return api.get<PaginatedResponse<Podcast>>('/api/podcasts', params);
}

// =====================================================
// ADMIN ACTIONS
// =====================================================

/**
 * Get all podcasts (admin)
 */
export async function getAdminPodcasts(params?: Partial<PodcastQuery>) {
    return api.get<PaginatedResponse<Podcast>>('/api/admin/podcasts', params);
}

/**
 * Get single podcast by ID (admin)
 */
export async function getAdminPodcast(id: string) {
    return api.get<ApiResponse<Podcast>>(`/api/admin/podcasts/${id}`);
}

/**
 * Create podcast (admin)
 */
export async function createPodcast(data: PodcastInput) {
    return api.post<ApiResponse<Podcast>>('/api/admin/podcasts', data);
}

/**
 * Update podcast (admin)
 */
export async function updatePodcast(id: string, data: PodcastUpdate) {
    return api.put<ApiResponse<Podcast>>(`/api/admin/podcasts/${id}`, data);
}

/**
 * Delete podcast (admin)
 */
export async function deletePodcast(id: string) {
    return api.delete<ApiResponse<null>>(`/api/admin/podcasts/${id}`);
}

/**
 * Sync podcasts from YouTube (admin)
 */
export async function syncPodcastsFromYouTube() {
    return api.post<ApiResponse<{ added: number; updated: number; removed: number }>>(
        '/api/admin/podcasts/sync'
    );
}
