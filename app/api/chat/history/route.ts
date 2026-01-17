/**
 * GET /api/chat/history
 * 
 * Guest gets their chat history
 */

import { getClientIp } from '@/lib/rate-limit';
import { hashIp, getSessionMessages, getSessionByIP } from '@/lib/chat/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const ipHash = await hashIp(clientIp);

        // Get session by IP
        const session = await getSessionByIP(ipHash);

        if (!session) {
            return NextResponse.json({ message: 'Session not found', data: null }, { status: 200 });
        }

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
