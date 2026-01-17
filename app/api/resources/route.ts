/**
 * GET /api/resources
 * 
 * Public endpoint - Get all resources
 */

import { createClient } from '@/lib/supabase/server';
import { resourceQuerySchema } from '@/lib/validators/resources';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = resourceQuerySchema.safeParse({
            format: searchParams.get('format'),
            category: searchParams.get('category'),
            tags: searchParams.get('tags'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { format, category, tags, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase.from('resources').select('*', { count: 'exact' });

        if (format) query = query.eq('format', format);
        if (category) query = query.eq('category', category);
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim());
            query = query.overlaps('tags', tagArray);
        }

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
        console.error('Get resources error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
