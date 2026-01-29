/**
 * GET /api/auth/session
 * 
 * Check admin authentication status
 */

import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({
                authenticated: false,
                user: null,
            });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { authenticated: false, user: null },
            { status: 200 }
        );
    }
}
