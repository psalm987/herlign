/**
 * GET/PUT/DELETE /api/admin/podcasts/:id
 * 
 * Get, update, or delete a single podcast
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { podcastUpdateSchema } from '@/lib/validators/podcasts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - Get single podcast by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        const { data, error } = await supabase
            .from('podcasts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'Podcast not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Podcast retrieved successfully',
            data,
        });
    } catch (error) {
        console.error('Get podcast error:', error);

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
 * PUT - Update podcast
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
        const validation = podcastUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        // Check if podcast exists
        const { data: existingPodcast } = await supabase
            .from('podcasts')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingPodcast) {
            return NextResponse.json(
                { error: 'Podcast not found' },
                { status: 404 }
            );
        }

        const updateData = { ...validation.data, admin_id: user.id };

        // Update podcast
        const { data, error } = await supabase
            .from('podcasts')
            .update(updateData as never)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            message: 'Podcast updated successfully',
            data,
        });
    } catch (error) {
        console.error('Update podcast error:', error);

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
 * DELETE - Delete podcast
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        // Check if podcast exists
        const { data: existingPodcast } = await supabase
            .from('podcasts')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingPodcast) {
            return NextResponse.json(
                { error: 'Podcast not found' },
                { status: 404 }
            );
        }

        // Delete podcast
        const { error } = await supabase
            .from('podcasts')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            message: 'Podcast deleted successfully',
        });
    } catch (error) {
        console.error('Delete podcast error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
