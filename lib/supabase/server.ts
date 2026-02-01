/**
 * Supabase Server Client
 * 
 * Use this client for server-side operations including:
 * - API routes
 * - Server components
 * - Server actions
 * 
 * This client uses cookies for authentication state management
 * and properly handles SSR scenarios.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './database.types';

/**
 * Creates a Supabase client for server-side use
 * 
 * @returns Supabase client instance with cookie-based auth
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // Cookies can only be modified in Server Actions or Route Handlers
                        // Ignore errors in other contexts (e.g., server components)
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch {
                        // Cookies can only be modified in Server Actions or Route Handlers
                        // Ignore errors in other contexts (e.g., server components)
                    }
                },
            },
        }
    );
}

/**
 * Creates an admin Supabase client with service role key
 * 
 * ⚠️ DANGER: This client bypasses RLS policies!
 * Only use for:
 * - Administrative operations
 * - System-level tasks
 * - Never expose to client-side
 * 
 * @returns Supabase admin client instance
 */
export function createAdminClient() {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get() { return undefined; },
                set() { },
                remove() { },
            },
        }
    );
}
