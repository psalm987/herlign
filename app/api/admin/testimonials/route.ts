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
            rating: searchParams.get('rating') || undefined,
            is_approved: searchParams.get('is_approved') || undefined,
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
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

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);
        const appliedFilters: Record<string, string | number | boolean> = {};
        if (rating !== undefined) appliedFilters.rating = rating;
        if (is_approved !== undefined) appliedFilters.is_approved = is_approved;

        return NextResponse.json({
            message: `Successfully retrieved ${data?.length || 0} testimonial(s)`,
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
            { message: 'Testimonial created successfully', data },
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
