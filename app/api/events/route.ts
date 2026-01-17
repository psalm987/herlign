/**
 * GET /api/events
 * 
 * Public endpoint - Get published events
 */

import { createClient } from '@/lib/supabase/server';
import { eventQuerySchema } from '@/lib/validators/events';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = eventQuerySchema.safeParse({
            type: searchParams.get('type'),
            mode: searchParams.get('mode'),
            status: 'published', // Force published for public
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { type, mode, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('events')
            .select('*', { count: 'exact' })
            .eq('status', 'published');

        if (type) query = query.eq('type', type);
        if (mode) query = query.eq('mode', mode);

        query = query
            .gte('end_date', new Date().toISOString()) // Only future/ongoing events
            .order('start_date', { ascending: true })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);
        const appliedFilters: Record<string, string> = { status: 'published' };
        if (type) appliedFilters.type = type;
        if (mode) appliedFilters.mode = mode;

        return NextResponse.json(
            {
                message: `Successfully retrieved ${data?.length || 0} published event(s)`,
                data: data || [],
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                },
                filters: appliedFilters,
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        );
    } catch (error) {
        console.error('Get events error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
