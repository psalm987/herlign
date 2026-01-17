/**
 * POST /api/admin/testimonials/[id]/approve
 * 
 * Approve a testimonial
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAuth();
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('testimonials')
            .update({ is_approved: true } as never)
            .eq('id', params.id)
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        return NextResponse.json({ data, message: 'Testimonial approved successfully' });
    } catch (error) {
        console.error('Approve testimonial error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
