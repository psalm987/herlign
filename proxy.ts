/**
 * Next.js Middleware
 * 
 * Protects admin routes from unauthorized access
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from './lib/supabase/server';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected admin routes
    if (pathname.startsWith('/api/admin')) {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Reject if not authenticated
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
