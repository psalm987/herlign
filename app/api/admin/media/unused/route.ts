/**
 * GET /api/admin/media/unused
 * 
 * List unused media files (for cleanup)
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await requireAuth();
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('is_used', false)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({
            message: `Successfully retrieved ${data?.length || 0} unused media file(s)`,
            data: data || []
        });
    } catch (error) {
        console.error('Get unused media error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
