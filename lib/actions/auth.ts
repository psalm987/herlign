/**
 * Authentication Actions
 * Handles all authentication-related API calls
 */

import { api } from '@/lib/services/api';
import type {
    LoginCredentials,
    AuthUser,
    SessionResponse,
    ApiResponse,
} from '@/lib/tanstack/types';

/**
 * Login admin user
 */
export async function login(
    credentials: LoginCredentials
): Promise<ApiResponse<AuthUser>> {
    return api.post<ApiResponse<AuthUser>>('/api/auth/login', credentials);
}

/**
 * Logout current user
 */
export async function logout(): Promise<ApiResponse<null>> {
    return api.post<ApiResponse<null>>('/api/auth/logout');
}

/**
 * Get current session
 */
export async function getSession(): Promise<SessionResponse> {
    return api.get<SessionResponse>('/api/auth/session');
}
