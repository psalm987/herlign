/**
 * GET /api/auth/callback
 * 
 * Server-side callback handler for magic link authentication
 * Exchanges PKCE code for session and sets chunked cookies (v0.8.0+)
 */

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle errors from Supabase
    if (error) {
        return NextResponse.redirect(
            new URL(
                `/callback?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`,
                request.url
            )
        );
    }

    // Exchange code for session
    if (code) {
        const cookieStore = await cookies();
        const redirectUrl = new URL('/callback?success=true', request.url);
        const response = NextResponse.redirect(redirectUrl);

        // Create Supabase client with response cookie handling
        // This allows the client to set cookies in the redirect response
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        // Set cookies in both the cookie store AND the response
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            return NextResponse.redirect(
                new URL(
                    `/callback?error=${encodeURIComponent(exchangeError.message)}`,
                    request.url
                )
            );
        }

        if (!data.session) {
            console.error('No session after exchange');
            return NextResponse.redirect(
                new URL('/callback?error=Failed to create session', request.url)
            );
        }

        console.log('Exchange successful - cookies set via setAll()');

        return response;
    }
}
