/**
 * Authentication Actions
 * Handles all authentication-related API calls
 */

import { api } from '@/lib/services/api';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
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
 * Uses browser client directly to avoid timing issues with cookie propagation
 */
export async function getSession(): Promise<SessionResponse> {
    // Use browser client directly to read session from cookies
    // This avoids timing issues where cookies from server redirects
    // haven't propagated yet when making API calls
    if (typeof window !== 'undefined') {
        const supabase = createBrowserClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return {
                authenticated: false,
                user: null,
            };
        }

        return {
            authenticated: true,
            user: {
                id: session.user.id,
                email: session.user.email || '',
            },
        };
    }

    // Fallback to API call for server-side (shouldn't happen in practice)
    return api.get<SessionResponse>('/api/auth/session');
}

/**
 * Request a password reset email
 */
export async function forgotPassword(
    email: string
): Promise<ApiResponse<null>> {
    return api.post<ApiResponse<null>>('/api/auth/forgot-password', { email });
}

/**
 * Reset password with new password (after clicking email link)
 */
export async function resetPassword(
    password: string
): Promise<ApiResponse<unknown>> {
    return api.post<ApiResponse<unknown>>('/api/auth/reset-password', { password });
}

/**
 * Request a magic link login email
 */
export async function requestMagicLink(
    email: string
): Promise<void> {
    // If running in the browser, initiate the magic-link flow client-side
    // so the PKCE code verifier is stored by the browser client (cookies/local storage).
    if (typeof window !== 'undefined') {
        const supabase = createBrowserClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
            },
        });

        if (error) {
            throw error;
        }
    }
}

/**
 * Verify an OTP token (magic link or recovery)
 */
export async function verifyOtp(params: {
    email: string;
    token: string;
    type?: 'signup' | 'magiclink' | 'recovery' | 'email_change';
}): Promise<ApiResponse<unknown>> {
    return api.post<ApiResponse<unknown>>('/api/auth/verify-otp', params);
}
