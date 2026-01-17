/**
 * POST /api/admin/chat/sessions/[id]/mode
 * 
 * Switch chat mode (auto/live)
 */

import { requireAuth } from '@/lib/auth';
import { switchChatMode } from '@/lib/chat/session';
import { chatModeSchema } from '@/lib/validators/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth();

        const body = await request.json();
        const validation = chatModeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { mode } = validation.data;

        const updatedSession = await switchChatMode(
            params.id,
            mode,
            mode === 'live' ? user.id : undefined
        );

        return NextResponse.json({
            message: `Chat mode switched to ${mode}`,
            data: updatedSession,
        });
    } catch (error) {
        console.error('Switch mode error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
