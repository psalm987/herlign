/**
 * Events Actions
 * Handles all event-related API calls (public and admin)
 */

import { api } from '@/lib/services/api';
import type {
    Event,
    EventInput,
    EventUpdate,
    EventQuery,
    PaginatedResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

// =====================================================
// Public Actions
// =====================================================

/**
 * Get published events (public)
 */
export async function getEvents(
    params?: EventQuery
): Promise<PaginatedResponse<Event>> {
    return api.get<PaginatedResponse<Event>>('/api/events', params);
}

// =====================================================
// Admin Actions
// =====================================================

/**
 * Get all events (admin)
 */
export async function getAdminEvents(
    params?: EventQuery
): Promise<PaginatedResponse<Event>> {
    return api.get<PaginatedResponse<Event>>('/api/admin/events', params);
}

/**
 * Get single event by ID (admin)
 */
export async function getAdminEvent(id: string): Promise<ApiResponse<Event>> {
    return api.get<ApiResponse<Event>>(`/api/admin/events/${id}`);
}

/**
 * Create new event (admin)
 */
export async function createEvent(
    data: EventInput
): Promise<ApiResponse<Event>> {
    return api.post<ApiResponse<Event>>('/api/admin/events', data);
}

/**
 * Update event (admin)
 */
export async function updateEvent(
    id: string,
    data: EventUpdate
): Promise<ApiResponse<Event>> {
    return api.put<ApiResponse<Event>>(`/api/admin/events/${id}`, data);
}

/**
 * Delete event (admin)
 */
export async function deleteEvent(id: string): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/api/admin/events/${id}`);
}
