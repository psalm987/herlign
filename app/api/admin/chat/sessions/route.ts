/**
 * GET /api/admin/chat/sessions
 * 
 * List all active chat sessions
 */

import { requireAuth } from '@/lib/auth';
import { listActiveSessions } from '@/lib/chat/session';
import { chatSessionQuerySchema } from '@/lib/validators/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await requireAuth();
        const searchParams = request.nextUrl.searchParams;
        const queryValidation = chatSessionQuerySchema.safeParse({
            mode: searchParams.get('mode'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.message },
                { status: 400 }
            );
        }

        const { mode, page, limit } = queryValidation.data;

        const { sessions, total } = await listActiveSessions({
            mode,
            page,
            limit,
        });

        const totalPages = Math.ceil(total / limit);
        const appliedFilters: Record<string, string> = {};
        if (mode) appliedFilters.mode = mode;

        return NextResponse.json({
            message: `Successfully retrieved ${sessions.length} chat session(s)`,
            data: sessions,
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
        console.error('Get chat sessions error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
