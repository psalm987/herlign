/**
 * POST /api/auth/logout
 * 
 * Admin logout endpoint
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            return NextResponse.json(
                { error: 'Logout failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
