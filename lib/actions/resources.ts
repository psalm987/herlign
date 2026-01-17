/**
 * Resources Actions
 * Handles all resource-related API calls (public and admin)
 */

import { api } from '@/lib/services/api';
import type {
    Resource,
    ResourceInput,
    ResourceUpdate,
    ResourceQuery,
    PaginatedResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

// =====================================================
// Public Actions
// =====================================================

/**
 * Get all resources (public)
 */
export async function getResources(
    params?: ResourceQuery
): Promise<PaginatedResponse<Resource>> {
    return api.get<PaginatedResponse<Resource>>('/api/resources', params);
}

// =====================================================
// Admin Actions
// =====================================================

/**
 * Get all resources (admin)
 */
export async function getAdminResources(
    params?: ResourceQuery
): Promise<PaginatedResponse<Resource>> {
    return api.get<PaginatedResponse<Resource>>('/api/admin/resources', params);
}

/**
 * Get single resource by ID (admin)
 */
export async function getAdminResource(
    id: string
): Promise<ApiResponse<Resource>> {
    return api.get<ApiResponse<Resource>>(`/api/admin/resources/${id}`);
}

/**
 * Create new resource (admin)
 */
export async function createResource(
    data: ResourceInput
): Promise<ApiResponse<Resource>> {
    return api.post<ApiResponse<Resource>>('/api/admin/resources', data);
}

/**
 * Update resource (admin)
 */
export async function updateResource(
    id: string,
    data: ResourceUpdate
): Promise<ApiResponse<Resource>> {
    return api.put<ApiResponse<Resource>>(`/api/admin/resources/${id}`, data);
}

/**
 * Delete resource (admin)
 */
export async function deleteResource(id: string): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/api/admin/resources/${id}`);
}
