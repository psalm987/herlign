/**
 * GET/PUT/DELETE /api/admin/testimonials/[id]
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { testimonialUpdateSchema } from '@/lib/validators/testimonials';
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
            .from('testimonials')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ message: 'Testimonial not found', data: null }, { status: 404 });
        }

        return NextResponse.json({ message: 'Successfully retrieved testimonial', data });
    } catch (error) {
        console.error('Get testimonial error:', error);
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
        await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        const body = await request.json();
        const validation = testimonialUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('testimonials')
            .update(validation.data as never)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json({ message: 'Testimonial not found', data: null }, { status: 404 });
        }

        return NextResponse.json({ message: 'Testimonial updated successfully', data });
    } catch (error) {
        console.error('Update testimonial error:', error);
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
        await requireAuth();
        const supabase = await createClient();
        const { id } = await params;

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ message: 'Testimonial not found', data: null }, { status: 404 });
        }

        return NextResponse.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Delete testimonial error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
