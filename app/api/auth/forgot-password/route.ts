/**
 * POST /api/auth/forgot-password
 *
 * Starts a password reset flow by emailing the user a reset link.
 */

import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { sendPasswordResetEmail } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.AUTH);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many password reset attempts',
                    resetIn: rateLimit.resetIn,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.resetIn.toString(),
                    },
                }
            );
        }

        const body = await request.json();
        const validation = forgotPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        await sendPasswordResetEmail(email);

        return NextResponse.json({
            message: 'Password reset email sent if the account exists',
            data: null,
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
