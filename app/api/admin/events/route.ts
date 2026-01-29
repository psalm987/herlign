/**
 * GET/POST /api/admin/events
 * 
 * List events (GET) or create new event (POST)
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { eventSchema, eventQuerySchema } from '@/lib/validators/events';
import { generateUniqueSlug } from '@/lib/utils/slug';
import { updateMediaUseCounts } from '@/lib/utils/media-count';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - List events with filtering and pagination
 */
export async function GET(request: NextRequest) {
    try {
        await requireAuth();
        const supabase = await createClient();

        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const queryValidation = eventQuerySchema.safeParse({
            type: searchParams.get('type') || undefined,
            mode: searchParams.get('mode') || undefined,
            status: searchParams.get('status') || undefined,
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

        const { type, mode, status, page, limit, search, dateFrom, dateTo, featured } = queryValidation.data;
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('events')
            .select('*', { count: 'exact' });

        if (type) query = query.eq('type', type);
        if (mode) query = query.eq('mode', mode);
        if (status) query = query.eq('status', status);
        if (featured !== undefined) query = query.eq('featured', featured);

        // Text search
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
            .order('start_date', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);
        const appliedFilters: Record<string, string> = {};
        if (type) appliedFilters.type = type;
        if (mode) appliedFilters.mode = mode;
        if (status) appliedFilters.status = status;
        if (search) appliedFilters.search = search;
        if (dateFrom) appliedFilters.dateFrom = dateFrom;
        if (dateTo) appliedFilters.dateTo = dateTo;
        if (featured !== undefined) appliedFilters.featured = String(featured);

        return NextResponse.json({
            message: `Successfully retrieved ${data?.length || 0} event(s)`,
            data: data || [],
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
            },
            filters: appliedFilters,
        });
    } catch (error) {
        console.error('Get events error:', error);

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
 * POST - Create new event
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        // Parse and validate request body
        const body = await request.json();
        const validation = eventSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        // Generate unique slug if not provided
        let slug = validation.data.slug;
        if (!slug) {
            slug = await generateUniqueSlug(validation.data.title);
        } else {
            // Verify slug is unique if provided by admin
            const { data: existingEvent } = await supabase
                .from('events')
                .select('id')
                .eq('slug', slug)
                .single();

            if (existingEvent) {
                return NextResponse.json(
                    { error: 'Slug already exists', details: 'Please choose a different slug' },
                    { status: 400 }
                );
            }
        }

        const eventData = { ...validation.data, slug, admin_id: user.id };

        // Create event
        const { data, error } = await supabase
            .from('events')
            .insert(eventData as never)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Update media use_count if image_url is provided
        if (validation.data.image_url) {
            await updateMediaUseCounts(supabase, null, validation.data.image_url);
        }

        return NextResponse.json(
            { message: 'Event created successfully', data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create event error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
