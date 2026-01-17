/**
 * Links Actions
 * Handles all link-related API calls (public and admin)
 */

import { api } from '@/lib/services/api';
import type {
    Link,
    LinkInput,
    LinkUpdate,
    LinkQuery,
    PaginatedResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

// =====================================================
// Public Actions
// =====================================================

/**
 * Get all links (public)
 */
export async function getLinks(
    params?: LinkQuery
): Promise<PaginatedResponse<Link>> {
    return api.get<PaginatedResponse<Link>>('/api/links', params);
}

// =====================================================
// Admin Actions
// =====================================================

/**
 * Get all links (admin)
 */
export async function getAdminLinks(
    params?: LinkQuery
): Promise<PaginatedResponse<Link>> {
    return api.get<PaginatedResponse<Link>>('/api/admin/links', params);
}

/**
 * Get single link by ID (admin)
 */
export async function getAdminLink(id: string): Promise<ApiResponse<Link>> {
    return api.get<ApiResponse<Link>>(`/api/admin/links/${id}`);
}

/**
 * Create new link (admin)
 */
export async function createLink(data: LinkInput): Promise<ApiResponse<Link>> {
    return api.post<ApiResponse<Link>>('/api/admin/links', data);
}

/**
 * Update link (admin)
 */
export async function updateLink(
    id: string,
    data: LinkUpdate
): Promise<ApiResponse<Link>> {
    return api.put<ApiResponse<Link>>(`/api/admin/links/${id}`, data);
}

/**
 * Delete link (admin)
 */
export async function deleteLink(id: string): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/api/admin/links/${id}`);
}
