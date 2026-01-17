/**
 * GET /api/chat/history
 * 
 * Guest gets their chat history
 */

import { getClientIp } from '@/lib/rate-limit';
import { hashIp, getOrCreateSession, getSessionMessages } from '@/lib/chat/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const ipHash = await hashIp(clientIp);

        // Get or create session
        const session = await getOrCreateSession(ipHash);

        // Get all messages
        const messages = await getSessionMessages(session.id);

        return NextResponse.json({
            sessionId: session.id,
            mode: session.current_mode,
            messages: messages.map((msg) => ({
                id: msg.id,
                sender: msg.sender_type,
                content: msg.content,
                timestamp: msg.created_at,
            })),
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
