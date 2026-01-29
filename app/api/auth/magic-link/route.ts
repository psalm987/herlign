/**
 * POST /api/auth/magic-link
 *
 * Starts an email-based one-time login (magic link) flow.
 */

import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { sendMagicLink } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const magicLinkSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.AUTH);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many login attempts',
                    resetIn: rateLimit.resetIn,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.resetIn.toString(),
                    },
                },
            );
        }

        const body = await request.json();
        const validation = magicLinkSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 },
            );
        }

        const { email } = validation.data;

        await sendMagicLink(email);

        return NextResponse.json({
            message: 'Magic link sent if the account exists',
            data: null,
        });
    } catch (error) {
        console.error('Magic link error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
