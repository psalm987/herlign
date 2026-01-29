/**
 * GET/POST /api/admin/resources
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { resourceSchema, resourceQuerySchema } from '@/lib/validators/resources';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await requireAuth();
        const supabase = await createClient();

        const searchParams = request.nextUrl.searchParams;
        const queryValidation = resourceQuerySchema.safeParse({
            format: searchParams.get('format') || undefined,
            category: searchParams.get('category') || undefined,
            tags: searchParams.get('tags') || undefined,
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
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

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);
        const appliedFilters: Record<string, string> = {};
        if (format) appliedFilters.format = format;
        if (category) appliedFilters.category = category;
        if (tags) appliedFilters.tags = tags;

        return NextResponse.json({
            message: `Successfully retrieved ${data?.length || 0} resource(s)`,
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
        console.error('Get resources error:', error);
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
        const validation = resourceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const resourceData = { ...validation.data, admin_id: user.id };

        const { data, error } = await supabase
            .from('resources')
            .insert(resourceData as never)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            { message: 'Resource created successfully', data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create resource error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
