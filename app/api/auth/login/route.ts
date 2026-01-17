/**
 * POST /api/auth/login
 * 
 * Admin login endpoint
 */

import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
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
                }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Attempt login
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
