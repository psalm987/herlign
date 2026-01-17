/**
 * GET/POST /api/admin/events
 * 
 * List events (GET) or create new event (POST)
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { eventSchema, eventQuerySchema } from '@/lib/validators/events';
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
            type: searchParams.get('type'),
            mode: searchParams.get('mode'),
            status: searchParams.get('status'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { type, mode, status, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('events')
            .select('*', { count: 'exact' });

        if (type) query = query.eq('type', type);
        if (mode) query = query.eq('mode', mode);
        if (status) query = query.eq('status', status);

        query = query
            .order('start_date', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            data: data || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
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

        const eventData = { ...validation.data, admin_id: user.id };

        // Create event
        const { data, error } = await supabase
            .from('events')
            .insert(eventData as never)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(
            { data, message: 'Event created successfully' },
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
