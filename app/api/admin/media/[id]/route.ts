/**
 * DELETE /api/admin/media/[id]
 * 
 * Delete media file
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { deleteFile } from '@/lib/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        // Get media record
        const { data: media, error: fetchError } = await supabase
            .from('media')
            .select('*')
            .eq('id', params.id)
            .eq('admin_id', user.id)
            .single();

        if (fetchError || !media) {
            return NextResponse.json(
                { error: 'Media not found or unauthorized' },
                { status: 404 }
            );
        }

        // Delete from storage
        await deleteFile((media as Record<string, unknown>)?.url as string);

        // Delete from database
        const { error: deleteError } = await supabase
            .from('media')
            .delete()
            .eq('id', params.id);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
