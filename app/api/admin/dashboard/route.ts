/**
 * GET /api/admin/dashboard
 * 
 * Get dashboard statistics for admin
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await requireAuth();
        const supabase = await createClient();

        // Get events stats (total vs published)
        const { count: totalEvents } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true });

        const { count: activeEvents } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published');

        // Get resources stats (all are public)
        const { count: totalResources } = await supabase
            .from('resources')
            .select('*', { count: 'exact', head: true });

        // Get testimonials stats (total vs approved)
        const { count: totalTestimonials } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true });

        const { count: activeTestimonials } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .eq('is_approved', true);

        // Get links stats (all are public)
        const { count: totalLinks } = await supabase
            .from('links')
            .select('*', { count: 'exact', head: true });

        // Get media stats (total vs used)
        const { count: totalMedia } = await supabase
            .from('media')
            .select('*', { count: 'exact', head: true });

        const { count: activeMedia } = await supabase
            .from('media')
            .select('*', { count: 'exact', head: true })
            .eq('is_used', true);

        // Get chat sessions stats (total vs active in last 24 hours)
        const { count: totalChats } = await supabase
            .from('chat_sessions')
            .select('*', { count: 'exact', head: true });

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: activeChats } = await supabase
            .from('chat_sessions')
            .select('*', { count: 'exact', head: true })
            .gte('last_message_at', twentyFourHoursAgo);

        return NextResponse.json({
            message: 'Dashboard stats retrieved successfully',
            data: {
                events: {
                    total: totalEvents || 0,
                    active: activeEvents || 0,
                },
                resources: {
                    total: totalResources || 0,
                    active: totalResources || 0, // All resources are public
                },
                testimonials: {
                    total: totalTestimonials || 0,
                    active: activeTestimonials || 0,
                },
                links: {
                    total: totalLinks || 0,
                    active: totalLinks || 0, // All links are public
                },
                media: {
                    total: totalMedia || 0,
                    active: activeMedia || 0,
                },
                chats: {
                    total: totalChats || 0,
                    active: activeChats || 0,
                },
            },
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
