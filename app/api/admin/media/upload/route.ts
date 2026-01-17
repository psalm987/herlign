/**
 * POST /api/admin/media/upload
 * 
 * Upload media file to Supabase Storage
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { uploadFile, getStorageQuota } from '@/lib/storage';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { mediaMetadataSchema } from '@/lib/validators/media';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();

        // Rate limiting
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.UPLOAD);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many upload attempts', resetIn: rateLimit.resetIn },
                {
                    status: 429,
                    headers: { 'Retry-After': rateLimit.resetIn.toString() },
                }
            );
        }

        // Get storage quota before upload
        const quota = await getStorageQuota();
        if (quota.alertThreshold) {
            console.warn(`Storage quota at ${quota.percentUsed.toFixed(1)}%`);
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const altText = formData.get('alt_text') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate alt_text if provided
        if (altText) {
            const validation = mediaMetadataSchema.safeParse({ alt_text: altText });
            if (!validation.success) {
                return NextResponse.json(
                    { error: 'Invalid alt text', details: validation.error.message },
                    { status: 400 }
                );
            }
        }

        // Upload file
        const uploadResult = await uploadFile(file, user.id);

        if (!uploadResult.success) {
            return NextResponse.json(
                { error: uploadResult.error },
                { status: 400 }
            );
        }

        // Save metadata to database
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('media')
            .insert({
                filename: uploadResult.filename!,
                url: uploadResult.url!,
                alt_text: altText,
                size: uploadResult.size!,
                mime_type: uploadResult.mime_type!,
                admin_id: user.id,
            } as never)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            {
                data,
                message: 'File uploaded successfully',
                quota: {
                    used: quota.used + uploadResult.size!,
                    percentUsed: ((quota.used + uploadResult.size!) / quota.limit) * 100,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Upload error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
