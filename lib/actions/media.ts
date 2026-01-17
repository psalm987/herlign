/**
 * Media Actions
 * Handles all media/file-related API calls (admin only)
 */

import { api } from '@/lib/services/api';
import type {
    Media,
    MediaUploadInput,
    MediaUploadResponse,
    PaginatedResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

// =====================================================
// Admin Actions
// =====================================================

/**
 * Get all media files (admin)
 */
export async function getAdminMedia(params?: {
    is_used?: boolean;
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<Media>> {
    return api.get<PaginatedResponse<Media>>('/api/admin/media', params);
}

/**
 * Get unused media files (admin)
 */
export async function getUnusedMedia(): Promise<ApiResponse<Media[]>> {
    return api.get<ApiResponse<Media[]>>('/api/admin/media/unused');
}

/**
 * Upload media file (admin)
 */
export async function uploadMedia(
    input: MediaUploadInput
): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', input.file);
    if (input.alt_text) {
        formData.append('alt_text', input.alt_text);
    }

    return api.post<MediaUploadResponse>('/api/admin/media/upload', formData);
}

/**
 * Delete media file (admin)
 */
export async function deleteMedia(id: string): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/api/admin/media/${id}`);
}
