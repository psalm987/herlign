/**
 * GET/POST /api/admin/links
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { linkSchema, linkQuerySchema } from '@/lib/validators/links';
import { NextRequest, NextResponse } from 'next/server';

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
        console.error('Get links error:', error);
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
        const validation = linkSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const linkData = { ...validation.data, admin_id: user.id };

        const { data, error } = await supabase
            .from('links')
            .insert(linkData as never)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            { data, message: 'Link created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create link error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
