/**
 * POST /api/auth/verify-otp
 *
 * Verifies an email OTP code and establishes a session.
 */

import { verifyEmailOtp } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const verifyOtpSchema = z.object({
    email: z.string().email('Invalid email format'),
    token: z.string().min(1, 'Token is required'),
    type: z
        .enum(['signup', 'magiclink', 'recovery', 'email_change'])
        .optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = verifyOtpSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 },
            );
        }

        const { email, token, type } = validation.data;

        // @ts-expect-error - TYPE WOULD BE FIXED
        const data = await verifyEmailOtp(email, token, { type });

        return NextResponse.json({
            message: 'OTP verified successfully',
            data,
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
