/**
 * Context Builder for AI Chat Bot
 * 
 * Builds dynamic context from database and static knowledge about Herlign FC
 */

import { createClient } from '../supabase/server';

/**
 * Static knowledge about Herlign FC
 */
export const HERLIGN_KNOWLEDGE = {
    mission: "Herlign Female Creatives (Herlign FC) is a women's career community platform that empowers women to navigate their creative journeys together. We provide a safe, inspiring space where women can be seen, validated, stay grounded, and enjoy the vibes.",

    tagline: "Inside Every Hero is a Her.",

    story: "Herlign Female Creatives was born from a simple but powerful idea: women shouldn't have to navigate their creative journeys alone. We wanted to create a safe, inspiring space where women can share their ideas, projects, and wins openly, feel supported and acknowledged in their efforts, connect with values that guide growth, and celebrate creativity, community, and fun.",

    values: [
        {
            name: "Visibility",
            description: "Every woman's ideas and voice are seen."
        },
        {
            name: "Validation",
            description: "Encouragement, recognition, and support along the way."
        },
        {
            name: "Values",
            description: "Grounding us with integrity, intention, and purpose."
        },
        {
            name: "Vulnerability",
            description: "A safe space to share challenges, met with empathy and solidarity."
        },
        {
            name: "Vibes",
            description: "An uplifting, energizing environment where women thrive."
        }
    ],

    goals: [
        "Be Seen - Share ideas, projects, and wins openly",
        "Be Validated - Feel supported and acknowledged in efforts",
        "Stay Grounded - Connect with values that guide growth",
        "Enjoy the Vibes - Celebrate creativity, community, and fun"
    ],

    audience: "We serve entrepreneurs, hobbyists, and anyone with creative ideas. If you have an idea, you're a creative. We design for busy brains with bite-sized insights and actionable content.",

    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://herlign.com'
};

/**
 * Event type for context
 */
export type EventContext = {
    id: string;
    title: string;
    description: string;
    type: 'event' | 'workshop';
    mode: 'live' | 'online';
    start_date: string;
    end_date: string;
    external_link: string | null;
    slug: string;
    featured: boolean;
};

/**
 * Fetches published events from database
 */
export async function getPublishedEvents(limit: number = 5): Promise<EventContext[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('events')
            .select('id, title, description, type, mode, start_date, end_date, external_link, slug, featured')
            .eq('status', 'published')
            .gte('end_date', new Date().toISOString())
            .order('featured', { ascending: false })
            .order('start_date', { ascending: true })
            .limit(limit);

        if (error) throw error;

        return (data as EventContext[]) || [];
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

/**
 * Resource type for context
 */
export type ResourceContext = {
    id: string;
    title: string;
    description: string;
    format: 'ebook' | 'guide' | 'template';
    category: string;
    external_link: string;
    tags: string[];
};

/**
 * Fetches resources from database
 */
export async function getResources(limit: number = 5): Promise<ResourceContext[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('resources')
            .select('id, title, description, format, category, external_link, tags')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data as ResourceContext[]) || [];
    } catch (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
}

/**
 * Podcast type for context
 */
export type PodcastContext = {
    id: string;
    title: string;
    description: string | null;
    youtube_video_id: string;
    published_at: string;
    tags: string[];
};

/**
 * Fetches visible podcasts from database
 */
export async function getPodcasts(limit: number = 5): Promise<PodcastContext[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('podcasts')
            .select('id, title, description, youtube_video_id, published_at, tags')
            .eq('is_visible', true)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data as PodcastContext[]) || [];
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        return [];
    }
}

/**
 * Searches events by keyword
 */
export async function searchEvents(query: string, limit: number = 3) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('events')
            .select('id, title, description, type, mode, start_date, external_link, slug')
            .eq('status', 'published')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(limit);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error searching events:', error);
        return [];
    }
}

/**
 * Searches resources by keyword or category
 */
export async function searchResources(query: string, limit: number = 3) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('resources')
            .select('id, title, description, format, category, external_link, tags')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
            .limit(limit);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error searching resources:', error);
        return [];
    }
}

/**
 * Searches podcasts by keyword
 */
export async function searchPodcasts(query: string, limit: number = 3) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('podcasts')
            .select('id, title, description, youtube_video_id, tags')
            .eq('is_visible', true)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(limit);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error searching podcasts:', error);
        return [];
    }
}

/**
 * Builds dynamic context based on user message
 */
export async function buildDynamicContext(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    let context = '';

    // Keywords for different content types
    const eventKeywords = ['event', 'workshop', 'webinar', 'meetup', 'session', 'happening', 'upcoming'];
    const resourceKeywords = ['resource', 'ebook', 'guide', 'template', 'download', 'material', 'learning'];
    const podcastKeywords = ['podcast', 'video', 'watch', 'episode', 'youtube'];
    const aboutKeywords = ['about', 'who', 'what is herlign', 'mission', 'values', 'story'];

    // Check if asking about Herlign
    if (aboutKeywords.some(keyword => lowerMessage.includes(keyword))) {
        context += `\n\nABOUT HERLIGN FC:\n`;
        context += `Mission: ${HERLIGN_KNOWLEDGE.mission}\n`;
        context += `Tagline: ${HERLIGN_KNOWLEDGE.tagline}\n`;
        context += `Story: ${HERLIGN_KNOWLEDGE.story}\n`;
        context += `\nOur 5 Values:\n`;
        HERLIGN_KNOWLEDGE.values.forEach(v => {
            context += `- ${v.name}: ${v.description}\n`;
        });
        context += `\nWebsite: ${HERLIGN_KNOWLEDGE.siteUrl}\n`;
    }

    // Check if asking about events
    if (eventKeywords.some(keyword => lowerMessage.includes(keyword))) {
        const events = await getPublishedEvents(3);
        if (events.length > 0) {
            context += `\n\nUPCOMING EVENTS:\n`;
            events.forEach(event => {
                const eventDate = new Date(event.start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                const eventUrl = `${HERLIGN_KNOWLEDGE.siteUrl}/events/${event.slug}`;
                context += `- ${event.title} (${event.type}, ${event.mode})\n`;
                context += `  Date: ${eventDate}\n`;
                context += `  ${event.description.slice(0, 100)}...\n`;
                context += `  Link: ${eventUrl}\n`;
                if (event.external_link) {
                    context += `  Register: ${event.external_link}\n`;
                }
                context += `\n`;
            });
        } else {
            context += `\n\nNo upcoming events at the moment. Check ${HERLIGN_KNOWLEDGE.siteUrl}/events for updates.\n`;
        }
    }

    // Check if asking about resources
    if (resourceKeywords.some(keyword => lowerMessage.includes(keyword))) {
        const resources = await getResources(3);
        if (resources.length > 0) {
            context += `\n\nAVAILABLE RESOURCES:\n`;
            resources.forEach(resource => {
                context += `- ${resource.title} (${resource.format})\n`;
                context += `  Category: ${resource.category}\n`;
                context += `  ${resource.description.slice(0, 100)}...\n`;
                context += `  Link: ${resource.external_link}\n\n`;
            });
        }
    }

    // Check if asking about podcasts
    if (podcastKeywords.some(keyword => lowerMessage.includes(keyword))) {
        const podcasts = await getPodcasts(3);
        if (podcasts.length > 0) {
            context += `\n\nRECENT PODCASTS:\n`;
            podcasts.forEach(podcast => {
                const youtubeUrl = `https://youtube.com/watch?v=${podcast.youtube_video_id}`;
                context += `- ${podcast.title}\n`;
                if (podcast.description) {
                    context += `  ${podcast.description.slice(0, 100)}...\n`;
                }
                context += `  Watch: ${youtubeUrl}\n\n`;
            });
        }
    }

    // If no specific keywords, provide general overview
    if (context === '') {
        context += `\n\nABOUT HERLIGN FC:\n`;
        context += `${HERLIGN_KNOWLEDGE.mission}\n`;
        context += `${HERLIGN_KNOWLEDGE.audience}\n`;
        context += `\nExplore: ${HERLIGN_KNOWLEDGE.siteUrl}\n`;
    }

    return context;
}

/**
 * Formats content recommendations
 */
export function formatRecommendation(type: 'event' | 'resource' | 'podcast', item: EventContext | ResourceContext | PodcastContext): string {
    const baseUrl = HERLIGN_KNOWLEDGE.siteUrl;

    switch (type) {
        case 'event':
            const eventItem = item as EventContext;
            const eventDate = new Date(eventItem.start_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric'
            });
            return `📅 **${eventItem.title}** (${eventDate})\n${baseUrl}/events/${eventItem.slug}`;

        case 'resource':
            const resourceItem = item as ResourceContext;
            return `📚 **${resourceItem.title}** (${resourceItem.format})\n${resourceItem.external_link}`;

        case 'podcast':
            const podcastItem = item as PodcastContext;
            return `🎥 **${podcastItem.title}**\nhttps://youtube.com/watch?v=${podcastItem.youtube_video_id}`;

        default:
            return '';
    }
}
