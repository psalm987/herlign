/**
 * Dashboard Actions
 * 
 * API calls for dashboard statistics
 */

import { api } from '@/lib/services/api';
import { ApiResponse } from '@/lib/tanstack/types';

export interface DashboardStats {
    events: {
        total: number;
        active: number;
    };
    resources: {
        total: number;
        active: number;
    };
    testimonials: {
        total: number;
        active: number;
    };
    links: {
        total: number;
        active: number;
    };
    media: {
        total: number;
        active: number;
    };
    chats: {
        total: number;
        active: number;
    };
}

/**
 * Get dashboard statistics (admin only)
 */
export async function getDashboardStats() {
    return api.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
}
