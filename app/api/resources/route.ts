/**
 * GET /api/resources
 * 
 * Public endpoint - Get all resources
 */

import { createClient } from '@/lib/supabase/server';
import { resourceQuerySchema } from '@/lib/validators/resources';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = resourceQuerySchema.safeParse({
            format: searchParams.get('format') || undefined,
            category: searchParams.get('category') || undefined,
            tags: searchParams.get('tags') || undefined,
            search: searchParams.get('search') || undefined,
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { format, category, tags, search, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase.from('resources').select('*', { count: 'exact' });

        if (format) query = query.eq('format', format);
        if (category) query = query.eq('category', category);
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim());
            query = query.overlaps('tags', tagArray);
        }

        // Text search - search in title and description
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);
        const appliedFilters: Record<string, string> = {};
        if (format) appliedFilters.format = format;
        if (category) appliedFilters.category = category;
        if (tags) appliedFilters.tags = tags;
        if (search) appliedFilters.search = search;

        return NextResponse.json(
            {
                message: `Successfully retrieved ${data?.length || 0} resource(s)`,
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
        console.error('Get resources error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
