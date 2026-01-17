/**
 * GET/PUT/DELETE /api/admin/links/[id]
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { linkUpdateSchema } from '@/lib/validators/links';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ message: 'Link not found', data: null }, { status: 404 });
        }

        return NextResponse.json({ message: 'Successfully retrieved link', data });
    } catch (error) {
        console.error('Get link error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        const body = await request.json();
        const validation = linkUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('links')
            .update(validation.data as never)
            .eq('id', id)
            .eq('admin_id', user.id)
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json(
                { message: 'Link not found or unauthorized', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Link updated successfully', data });
    } catch (error) {
        console.error('Update link error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', id)
            .eq('admin_id', user.id);

        if (error) {
            return NextResponse.json(
                { error: 'Link not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Delete link error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
