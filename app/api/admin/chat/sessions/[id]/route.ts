/**
 * GET/POST /api/admin/chat/sessions/[id]
 * 
 * Get session details (GET) or send admin response (POST)
 */

import { requireAuth } from '@/lib/auth';
import { getSession, getSessionMessages, addMessage, switchChatMode } from '@/lib/chat/session';
import { chatMessageSchema } from '@/lib/validators/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;
        const session = await getSession(id);
        if (!session) {
            return NextResponse.json({ message: 'Session not found', data: null }, { status: 404 });
        }

        const messages = await getSessionMessages(id);

        return NextResponse.json({
            message: 'Successfully retrieved chat session',
            data: {
                session,
                messages: messages.map((msg) => ({
                    id: msg.id,
                    sender: msg.sender_type,
                    content: msg.content,
                    timestamp: msg.created_at,
                })),
            },
        });
    } catch (error) {
        console.error('Get session error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();
        const { id } = await params;

        const body = await request.json();
        const validation = chatMessageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { message } = validation.data;

        // Switch to live mode if not already
        const session = await getSession(id);
        if (session && session.current_mode !== 'live') {
            await switchChatMode(id, 'live', user.id);
        }

        // Add admin message
        await addMessage(id, 'admin', message);

        return NextResponse.json({ message: 'Message sent successfully', data: null });
    } catch (error) {
        console.error('Send message error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
