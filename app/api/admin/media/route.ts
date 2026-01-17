/**
 * GET /api/admin/media
 * 
 * List uploaded media files
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { mediaQuerySchema } from '@/lib/validators/media';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await requireAuth();
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = mediaQuerySchema.safeParse({
            is_used: searchParams.get('is_used'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { is_used, page, limit } = queryValidation.data;
        const offset = (page - 1) * limit;

        let query = supabase.from('media').select('*', { count: 'exact' });

        if (is_used !== undefined) query = query.eq('is_used', is_used);

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
        console.error('Get media error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
