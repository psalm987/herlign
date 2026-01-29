/**
 * GET/PUT/DELETE /api/admin/events/[id]
 * 
 * Get, update, or delete a specific event
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { eventUpdateSchema } from '@/lib/validators/events';
import { isValidSlug } from '@/lib/utils/slug';
import { updateMediaUseCounts, decrementMediaUseCount } from '@/lib/utils/media-count';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - Get single event by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        // Parse and validate request body
        const body = await request.json();
        const validation = eventUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        // If slug is being updated, validate it and check uniqueness
        if (validation.data.slug) {
            if (!isValidSlug(validation.data.slug)) {
                return NextResponse.json(
                    { error: 'Invalid slug format', details: 'Slug must be 6-20 characters, lowercase letters, numbers, and hyphens only' },
                    { status: 400 }
                );
            }

            // Check if slug already exists (excluding current event)
            const { data: existingEvent } = await supabase
                .from('events')
                .select('id')
                .eq('slug', validation.data.slug)
                .neq('id', id)
                .single();

            if (existingEvent) {
                return NextResponse.json(
                    { error: 'Slug already exists', details: 'Please choose a different slug' },
                    { status: 400 }
                );
            }
        }

        // Get current event to track old image_url
        const { data: currentEvent } = await supabase
            .from('events')
            .select('image_url')
            .eq('id', id)
            .eq('admin_id', user.id)
            .single();

        if (!currentEvent) {
            return NextResponse.json(
                { message: 'Event not found or unauthorized', data: null },
                { status: 404 }
            );
        }

        // Update event
        const { data, error } = await supabase
            .from('events')
            .update(validation.data as never)
            .eq('id', id)
            .eq('admin_id', user.id) // Ensure admin owns the event
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json(
                { message: 'Event not found or unauthorized', data: null },
                { status: 404 }
            );
        }

        // Update media use_count if image_url changed
        if (validation.data.image_url !== undefined) {
            await updateMediaUseCounts(
                supabase,
                // @ts-expect-error - currentEvent should have image_url
                currentEvent.image_url,
                validation.data.image_url
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        // Get current event to track image_url before deletion
        const { data: currentEvent } = await supabase
            .from('events')
            .select('image_url')
            .eq('id', id)
            .eq('admin_id', user.id)
            .single();

        if (!currentEvent) {
            return NextResponse.json(
                { error: 'Event not found or unauthorized' },
                { status: 404 }
            );
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)
            .eq('admin_id', user.id); // Ensure admin owns the event

        if (error) {
            return NextResponse.json(
                { error: 'Event not found or unauthorized' },
                { status: 404 }
            );
        }

        // Decrement media use_count if image_url exists
        // @ts-expect-error - currentEvent should have image_url
        if (currentEvent.image_url) {
            // @ts-expect-error - currentEvent should have image_url
            await decrementMediaUseCount(supabase, currentEvent.image_url);
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
