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
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            // cookies: {
            // get(name: string) {
            //     // Parse cookies from document.cookie
            //     const cookies = document.cookie.split('; ');

            //     console.log('Browser client reading cookies:');
            //     cookies.forEach(c => {
            //         if (c.startsWith('sb-')) {
            //             console.log(`  ${c}`);
            //         }
            //     });
            //     const cookie = cookies.find(c => c.startsWith(`${name}=`));
            //     let value = cookie?.split('=').slice(1).join('='); // Handle values with = in them

            //     // Remove surrounding quotes if present (Supabase stores some cookies as JSON strings)
            //     if (value && value.startsWith('"') && value.endsWith('"')) {
            //         try {
            //             // Try to parse as JSON to handle escaped quotes
            //             value = JSON.parse(value);
            //         } catch {
            //             // If JSON parse fails, just strip the outer quotes
            //             value = value?.slice(1, -1);
            //         }
            //     }

            //     return value;
            // },
            // set(name: string, value: string, options: { maxAge?: number; path?: string; sameSite?: boolean | "lax" | "strict" | "none"; secure?: boolean }) {
            //     // Set cookie using document.cookie with proper defaults
            //     let cookieString = `${name}=${value}`;

            //     // Always set path to root to ensure server can access it
            //     cookieString += `; path=${options.path || '/'}`;

            //     if (options.maxAge) {
            //         cookieString += `; max-age=${options.maxAge}`;
            //     }
            //     if (options.sameSite) {
            //         cookieString += `; samesite=${options.sameSite}`;
            //     } else {
            //         // Default to Lax for better compatibility
            //         cookieString += '; samesite=lax';
            //     }
            //     if (options.secure !== false) {
            //         // Default to secure in production
            //         if (window.location.protocol === 'https:') {
            //             cookieString += '; secure';
            //         }
            //     }

            //     console.log('Browser client setting cookie:', name, 'value length:', value.length);
            //     document.cookie = cookieString;

            //     // Verify it was set
            //     setTimeout(() => {
            //         const cookies = document.cookie.split('; ');
            //         console.log('Browser client cookies after set:');
            //         cookies.forEach(c => {
            //             if (c.startsWith('sb-')) {
            //                 console.log(`  ${c}`);
            //             }
            //         });
            //         const setCookie = cookies.find(c => c.startsWith(`${name}=`));
            //         console.log('Cookie verification:', name, setCookie ? 'SET' : 'NOT SET', setCookie?.substring(0, 100));
            //     }, 0);
            // },
            //     remove(name: string, options: { path?: string }) {
            //         // Remove cookie by setting max-age to 0 with same path
            //         let cookieString = `${name}=; max-age=0`;
            //         cookieString += `; path=${options.path || '/'}`;

            //         console.log('Browser client removing cookie:', name);

            //         document.cookie = cookieString;
            //     },
            // },
        }
    );
}
