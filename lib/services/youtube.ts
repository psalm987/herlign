/**
 * YouTube API Service
 * 
 * Handles fetching videos from YouTube Data API v3
 */

import type { YouTubeVideo } from '@/lib/validators/podcasts';
import type { Podcast } from '@/lib/actions/podcasts';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch all videos from the configured YouTube channel
 */
export async function fetchYouTubeChannelVideos(): Promise<Podcast[]> {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
        throw new Error('YouTube API key or channel ID not configured');
    }

    const allVideos: Podcast[] = [];
    let pageToken: string | undefined;

    try {
        do {
            // Fetch uploads playlist ID
            const channelResponse = await fetch(
                `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
            );

            if (!channelResponse.ok) {
                throw new Error(`Failed to fetch channel: ${channelResponse.statusText}`);
            }

            const channelData = await channelResponse.json();
            const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

            if (!uploadsPlaylistId) {
                throw new Error('Could not find uploads playlist');
            }

            // Fetch videos from uploads playlist
            const playlistUrl = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
            playlistUrl.searchParams.set('part', 'snippet,contentDetails');
            playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
            playlistUrl.searchParams.set('maxResults', '50');
            playlistUrl.searchParams.set('key', YOUTUBE_API_KEY);
            if (pageToken) {
                playlistUrl.searchParams.set('pageToken', pageToken);
            }

            const playlistResponse = await fetch(playlistUrl.toString());

            if (!playlistResponse.ok) {
                throw new Error(`Failed to fetch playlist: ${playlistResponse.statusText}`);
            }

            const playlistData = await playlistResponse.json();
            const videoIds = playlistData.items?.map((item: { contentDetails: { videoId: string } }) => item.contentDetails.videoId) || [];

            if (videoIds.length === 0) {
                break;
            }

            // Fetch detailed video information
            const videosUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
            videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics');
            videosUrl.searchParams.set('id', videoIds.join(','));
            videosUrl.searchParams.set('key', YOUTUBE_API_KEY);

            const videosResponse = await fetch(videosUrl.toString());

            if (!videosResponse.ok) {
                throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`);
            }

            const videosData = await videosResponse.json();

            // Transform to Podcast format
            const videos: Podcast[] = videosData.items?.map((video: YouTubeVideo) => ({
                youtube_video_id: video.id,
                title: video.snippet.title,
                description: video.snippet.description || null,
                thumbnail_url: video.snippet.thumbnails.high?.url ||
                    video.snippet.thumbnails.medium?.url ||
                    video.snippet.thumbnails.default?.url ||
                    null,
                published_at: video.snippet.publishedAt,
                duration: video.contentDetails?.duration || null,
                view_count: parseInt(video.statistics?.viewCount || '0', 10),
                like_count: parseInt(video.statistics?.likeCount || '0', 10),
                comment_count: parseInt(video.statistics?.commentCount || '0', 10),
                channel_title: video.snippet.channelTitle || null,
                tags: video.snippet.tags || [],
                category_id: video.snippet.categoryId || null,
                is_visible: true,
                admin_id: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as Podcast)) || [];

            allVideos.push(...videos);

            pageToken = playlistData.nextPageToken;
        } while (pageToken);

        return allVideos;
    } catch (error) {
        console.error('YouTube API error:', error);
        throw error;
    }
}

/**
 * Parse ISO 8601 duration to readable format
 * Example: PT15M30S -> "15:30"
 */
export function parseYouTubeDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
