/**
 * POST /api/auth/reset-password
 *
 * Completes a password reset by setting a new password for the
 * currently authenticated user (via Supabase reset link).
 */

import { updatePassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 },
            );
        }

        const { password } = validation.data;

        const data = await updatePassword(password);

        return NextResponse.json({
            message: 'Password updated successfully',
            data,
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
