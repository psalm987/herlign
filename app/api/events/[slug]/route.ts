/**
 * GET /api/events/[slug]
 * 
 * Get a single event by slug
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

/**
 * GET - Get single event by slug
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const supabase = await createClient();
        const { slug } = await params;

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published') // Only published events
            .single();

        if (error || !data) {
            console.error({ error })
            return NextResponse.json(
                { message: 'Event not found', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Successfully retrieved event',
            data,
        });
    } catch (error) {
        console.error('Get event by slug error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
