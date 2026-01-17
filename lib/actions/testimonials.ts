/**
 * Testimonials Actions
 * Handles all testimonial-related API calls (public and admin)
 */

import { api } from '@/lib/services/api';
import type {
    Testimonial,
    TestimonialInput,
    TestimonialUpdate,
    TestimonialQuery,
    PaginatedResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

// =====================================================
// Public Actions
// =====================================================

/**
 * Get approved testimonials (public)
 */
export async function getTestimonials(
    params?: TestimonialQuery
): Promise<PaginatedResponse<Testimonial>> {
    return api.get<PaginatedResponse<Testimonial>>('/api/testimonials', params);
}

// =====================================================
// Admin Actions
// =====================================================

/**
 * Get all testimonials (admin)
 */
export async function getAdminTestimonials(
    params?: TestimonialQuery
): Promise<PaginatedResponse<Testimonial>> {
    return api.get<PaginatedResponse<Testimonial>>(
        '/api/admin/testimonials',
        params
    );
}

/**
 * Get single testimonial by ID (admin)
 */
export async function getAdminTestimonial(
    id: string
): Promise<ApiResponse<Testimonial>> {
    return api.get<ApiResponse<Testimonial>>(`/api/admin/testimonials/${id}`);
}

/**
 * Create new testimonial (admin)
 */
export async function createTestimonial(
    data: TestimonialInput
): Promise<ApiResponse<Testimonial>> {
    return api.post<ApiResponse<Testimonial>>('/api/admin/testimonials', data);
}

/**
 * Update testimonial (admin)
 */
export async function updateTestimonial(
    id: string,
    data: TestimonialUpdate
): Promise<ApiResponse<Testimonial>> {
    return api.put<ApiResponse<Testimonial>>(
        `/api/admin/testimonials/${id}`,
        data
    );
}

/**
 * Delete testimonial (admin)
 */
export async function deleteTestimonial(
    id: string
): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/api/admin/testimonials/${id}`);
}

/**
 * Approve testimonial (admin)
 */
export async function approveTestimonial(
    id: string
): Promise<ApiResponse<Testimonial>> {
    return api.post<ApiResponse<Testimonial>>(
        `/api/admin/testimonials/${id}/approve`
    );
}
