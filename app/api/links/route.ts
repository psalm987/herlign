/**
 * GET /api/links
 * 
 * Public endpoint - Get all links
 */

import { createClient } from '@/lib/supabase/server';
import { linkQuerySchema } from '@/lib/validators/links';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = linkQuerySchema.safeParse({
            category: searchParams.get('category'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { category, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase.from('links').select('*', { count: 'exact' });

        if (category) query = query.eq('category', category);

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
        console.error('Get links error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
