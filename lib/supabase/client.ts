/**
 * Supabase Browser Client
 * 
 * Use this client for client-side operations including:
 * - Client components
 * - Browser-based interactions
 * - Real-time subscriptions
 * 
 * This client automatically handles browser-based authentication.
 */

import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';

/**
 * Creates a Supabase client for browser/client-side use
 * 
 * @returns Supabase client instance for client components
 */
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );
}
