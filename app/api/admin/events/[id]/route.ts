/**
 * GET/PUT/DELETE /api/admin/events/[id]
 * 
 * Get, update, or delete a specific event
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { eventUpdateSchema } from '@/lib/validators/events';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - Get single event by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { message: 'Event not found', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Successfully retrieved event', data });
    } catch (error) {
        console.error('Get event error:', error);

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
 * PUT - Update event
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        // Parse and validate request body
        const body = await request.json();
        const validation = eventUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        // Update event
        const { data, error } = await supabase
            .from('events')
            .update(validation.data as never)
            .eq('id', params.id)
            .eq('admin_id', user.id) // Ensure admin owns the event
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json(
                { message: 'Event not found or unauthorized', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Event updated successfully', data });
    } catch (error) {
        console.error('Update event error:', error);

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
 * DELETE - Delete event
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', params.id)
            .eq('admin_id', user.id); // Ensure admin owns the event

        if (error) {
            return NextResponse.json(
                { error: 'Event not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
