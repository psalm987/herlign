/**
 * POST /api/chat/message
 * 
 * Guest sends a chat message
 */

import { chatMessageSchema } from '@/lib/validators/chat';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { hashIp, getOrCreateSession, addMessage, getSessionMessages } from '@/lib/chat/session';
import { getAIResponse, getFallbackResponse } from '@/lib/chat/ai-handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.CHAT);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many messages', resetIn: rateLimit.resetIn },
                {
                    status: 429,
                    headers: { 'Retry-After': rateLimit.resetIn.toString() },
                }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = chatMessageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { message } = validation.data;

        // Hash IP and get/create session
        const ipHash = await hashIp(clientIp);
        const session = await getOrCreateSession(ipHash);

        // Add guest message
        await addMessage(session.id, 'guest', message);

        // Get response based on chat mode
        let botResponse: string;

        if (session.current_mode === 'auto') {
            // Get AI response
            const messages = await getSessionMessages(session.id);
            const aiResponse = await getAIResponse(messages);

            if (aiResponse.error) {
                botResponse = getFallbackResponse();
                console.error('AI error:', aiResponse.error);
            } else {
                botResponse = aiResponse.content;
            }

            // Add bot message
            await addMessage(session.id, 'bot', botResponse);
        } else {
            // Live mode - notify that admin will respond
            botResponse = 'An admin will respond to you shortly.';
        }

        return NextResponse.json({
            sessionId: session.id,
            response: botResponse,
            mode: session.current_mode,
        });
    } catch (error) {
        console.error('Chat message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
