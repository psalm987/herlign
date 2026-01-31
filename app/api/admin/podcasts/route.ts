/**
 * GET/POST /api/admin/podcasts
 * 
 * List podcasts (GET) or create new podcast (POST)
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { podcastQuerySchema, podcastCreateSchema } from '@/lib/validators/podcasts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - List podcasts with filtering and pagination (admin)
 */
export async function GET(request: NextRequest) {
    try {
        await requireAuth();
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
            is_visible: searchParams.get('is_visible') || undefined,
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { page = 1, limit = 20, search, tags, dateFrom, dateTo, sortBy = "created_at", sortOrder, is_visible } = queryValidation.data || {};
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('podcasts')
            .select('*', { count: 'exact' });

        // Visibility filter (admin can see all)
        if (is_visible !== undefined) {
            query = query.eq('is_visible', is_visible);
        }

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
        console.error('Get admin podcasts error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST - Create new podcast (admin)
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        // Parse and validate request body
        const body = await request.json();
        const validation = podcastCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        // Check if video ID already exists
        const { data: existingPodcast } = await supabase
            .from('podcasts')
            .select('id')
            .eq('youtube_video_id', validation.data.youtube_video_id)
            .single();

        if (existingPodcast) {
            return NextResponse.json(
                { error: 'Podcast with this YouTube video ID already exists' },
                { status: 400 }
            );
        }

        const podcastData = { ...validation.data, admin_id: user.id };

        // Create podcast
        const { data, error } = await supabase
            .from('podcasts')
            .insert(podcastData as never)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(
            { message: 'Podcast created successfully', data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create podcast error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
