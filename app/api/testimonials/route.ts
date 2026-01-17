/**
 * GET /api/testimonials
 * 
 * Public endpoint - Get approved testimonials
 */

import { createClient } from '@/lib/supabase/server';
import { testimonialQuerySchema } from '@/lib/validators/testimonials';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = testimonialQuerySchema.safeParse({
            rating: searchParams.get('rating'),
            is_approved: 'true', // Force approved for public
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { rating, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('testimonials')
            .select('*', { count: 'exact' })
            .eq('is_approved', true);

        if (rating !== undefined) query = query.eq('rating', rating);

        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return NextResponse.json(
            {
                data: data || [],
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        );
    } catch (error) {
        console.error('Get testimonials error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
