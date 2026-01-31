/**
 * GET /api/podcasts
 * 
 * Get visible podcasts (public)
 */

import { createClient } from '@/lib/supabase/server';
import { podcastQuerySchema } from '@/lib/validators/podcasts';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5-minute cache

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const queryValidation = podcastQuerySchema.safeParse({
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
            search: searchParams.get('search') || undefined,
            tags: searchParams.get('tags') || undefined,
            dateFrom: searchParams.get('dateFrom') || undefined,
            dateTo: searchParams.get('dateTo') || undefined,
            sortBy: searchParams.get('sortBy') || undefined,
            sortOrder: searchParams.get('sortOrder') || undefined,
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { page = 1, limit = 20, search, tags, dateFrom, dateTo, sortBy = "published_at", sortOrder = "desc" } = queryValidation.data || {};
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('podcasts')
            .select('*', { count: 'exact' })
            .eq('is_visible', true); // Only visible podcasts for public

        // Text search
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Tags filter
        if (tags) {
            const tagArray = tags.split(',').map((t) => t.trim());
            query = query.overlaps('tags', tagArray);
        }

        // Date range filtering
        if (dateFrom) {
            query = query.gte('published_at', dateFrom);
        }
        if (dateTo) {
            query = query.lte('published_at', dateTo);
        }

        // Sorting
        const ascending = sortOrder === 'asc';
        query = query.order(sortBy, { ascending });

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: `Successfully retrieved ${data?.length || 0} podcast(s)`,
            data: data || [],
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
            },
        });
    } catch (error) {
        console.error('Get podcasts error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
