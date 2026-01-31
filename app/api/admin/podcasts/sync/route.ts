/**
 * POST /api/admin/podcasts/sync
 * 
 * Manually sync podcasts from YouTube
 */

import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { fetchYouTubeChannelVideos } from '@/lib/services/youtube';
import { NextResponse } from 'next/server';
import { Podcast } from '@/lib/actions/podcasts';

export async function POST() {
    try {
        const user = await requireAuth();
        const supabase = await createClient();

        // Fetch all videos from YouTube
        const youtubeVideos = await fetchYouTubeChannelVideos();

        if (youtubeVideos.length === 0) {
            return NextResponse.json({
                message: 'No videos found on YouTube channel',
                data: { added: 0, updated: 0, removed: 0 },
            });
        }

        // Get existing podcasts from database
        const { data: existingPodcasts } = await supabase
            .from('podcasts')
            .select('id, youtube_video_id, is_visible');

        const existingVideoIds = new Set(
            existingPodcasts?.map((p: { youtube_video_id: string }) => p.youtube_video_id) || []
        );
        const youtubeVideoIds = new Set(youtubeVideos.map((v) => v.youtube_video_id));

        let added = 0;
        let updated = 0;
        let removed = 0;

        // Add new videos
        for (const video of youtubeVideos) {
            if (!existingVideoIds.has(video.youtube_video_id)) {
                const { error } = await supabase
                    .from('podcasts')
                    .insert({
                        ...video,
                        admin_id: user.id,
                    } as never);

                if (!error) {
                    added++;
                } else {
                    console.error(`Failed to add video ${video.youtube_video_id}:`, error);
                }
            } else {
                // Update existing video metadata (preserve is_visible)
                // const existingPodcast = existingPodcasts?.find(
                //     (p: { youtube_video_id: string }) => p.youtube_video_id === video.youtube_video_id
                // );

                const { error } = await supabase
                    .from('podcasts')
                    .update({
                        title: video.title,
                        description: video.description,
                        thumbnail_url: video.thumbnail_url,
                        published_at: video.published_at,
                        duration: video.duration,
                        view_count: video.view_count,
                        like_count: video.like_count,
                        comment_count: video.comment_count,
                        channel_title: video.channel_title,
                        tags: video.tags,
                        category_id: video.category_id,
                        // Preserve is_visible - don't change it
                        admin_id: user.id,
                    } as never)
                    .eq('youtube_video_id', video.youtube_video_id);

                if (!error) {
                    updated++;
                } else {
                    console.error(`Failed to update video ${video.youtube_video_id}:`, error);
                }
            }
        }

        // Remove videos that no longer exist on YouTube
        if (existingPodcasts) {
            for (const podcast of existingPodcasts) {
                if (!youtubeVideoIds.has((podcast as Podcast)?.youtube_video_id)) {
                    const { error } = await supabase
                        .from('podcasts')
                        .delete()
                        .eq('id', (podcast as Podcast)?.id);

                    if (!error) {
                        removed++;
                    } else {
                        console.error(`Failed to remove video ${(podcast as Podcast)?.youtube_video_id}:`, error);
                    }
                }
            }
        }

        return NextResponse.json({
            message: 'Podcasts synced successfully from YouTube',
            data: { added, updated, removed },
        });
    } catch (error) {
        console.error('Sync podcasts error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (error instanceof Error && error.message.includes('YouTube')) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
