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
            type: searchParams.get('type') || undefined,
            mode: searchParams.get('mode') || undefined,
            status: 'published', // Force published for public
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
            search: searchParams.get('search') || undefined,
            dateFrom: searchParams.get('dateFrom') || undefined,
            dateTo: searchParams.get('dateTo') || undefined,
            featured: searchParams.get('featured') || undefined,
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { type, mode, page, limit, search, dateFrom, dateTo, featured } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('events')
            .select('*', { count: 'exact' })
            .eq('status', 'published');

        if (type) query = query.eq('type', type);
        if (mode) query = query.eq('mode', mode);
        if (featured !== undefined) query = query.eq('featured', featured);

        // Text search - search in title and description
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Date range filtering
        if (dateFrom) {
            query = query.gte('start_date', dateFrom);
        }
        if (dateTo) {
            query = query.lte('start_date', dateTo);
        }

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
        if (search) appliedFilters.search = search;
        if (dateFrom) appliedFilters.dateFrom = dateFrom;
        if (dateTo) appliedFilters.dateTo = dateTo;
        if (featured !== undefined) appliedFilters.featured = String(featured);

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
