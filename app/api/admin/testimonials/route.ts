/**
 * GET/POST /api/admin/testimonials
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { testimonialSchema, testimonialQuerySchema } from '@/lib/validators/testimonials';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await requireAuth();
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = testimonialQuerySchema.safeParse({
            rating: searchParams.get('rating'),
            is_approved: searchParams.get('is_approved'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { rating, is_approved, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase.from('testimonials').select('*', { count: 'exact' });

        if (rating !== undefined) query = query.eq('rating', rating);
        if (is_approved !== undefined) query = query.eq('is_approved', is_approved);

        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

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
        console.error('Get testimonials error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        const body = await request.json();
        const validation = testimonialSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const testimonialData = { ...validation.data, admin_id: user.id };

        const { data, error } = await supabase
            .from('testimonials')
            .insert(testimonialData as never)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            { data, message: 'Testimonial created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create testimonial error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
