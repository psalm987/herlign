/**
 * Authentication Utilities
 * 
 * Helper functions for authentication and user management
 */

import { createClient } from './supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Gets the current authenticated admin user
 * 
 * @returns User object or null if not authenticated
 */
export async function getAuthUser() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

/**
 * Requires authentication - throws error if not authenticated
 * Use in API routes that require admin access
 * 
 * @returns User object
 * @throws Error if not authenticated
 */
export async function requireAuth() {
    const user = await getAuthUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}

/**
 * Middleware helper to protect admin routes
 * Returns 401 response if not authenticated
 * 
 * @param request - Next.js request object
 * @param handler - The actual route handler to execute if authenticated
 * @returns Response from handler or 401 error
 */
export async function withAuth(
    request: NextRequest,
    handler: (request: NextRequest, user: unknown) => Promise<Response>
): Promise<Response> {
    try {
        const user = await requireAuth();
        return await handler(request, user);
    } catch (error: unknown) {
        console.error('Authentication error:', error);
        return NextResponse.json(
            { error: 'Unauthorized - Admin access required' },
            { status: 401 }
        );
    }
}

/**
 * Validates admin email (optional - for restricting admin access)
 * Implement this if you want to restrict admin access to specific domains
 * 
 * @param email - Email to validate
 * @returns True if email is allowed admin domain
 */
export function isAllowedAdminEmail(email: string): boolean {
    // Option 1: Allow specific email domains
    const allowedDomains = process.env.ALLOWED_ADMIN_DOMAINS?.split(',') || [];
    if (allowedDomains.length > 0) {
        const emailDomain = email.split('@')[1];
        return allowedDomains.includes(emailDomain);
    }

    // Option 2: Allow all (less restrictive - rely on manual user creation in Supabase)
    return true;
}
