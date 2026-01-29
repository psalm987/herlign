/**
 * Media Use Count Utilities
 * 
 * Handles automatic tracking of media file usage across content
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Updates media use_count based on URL changes
 * Handles increment/decrement and ensures minimum of 0
 * 
 * @param supabase - Supabase client
 * @param oldUrl - Previous media URL (null/empty = no media)
 * @param newUrl - New media URL (null/empty = no media)
 */
export async function updateMediaUseCounts(
    supabase: SupabaseClient,
    oldUrl: string | null | undefined,
    newUrl: string | null | undefined
): Promise<void> {
    // Calculate net changes for each unique URL
    const changes = new Map<string, number>();

    // Decrement old URL if it exists
    if (oldUrl && oldUrl !== '') {
        changes.set(oldUrl, (changes.get(oldUrl) || 0) - 1);
    }

    // Increment new URL if it exists
    if (newUrl && newUrl !== '') {
        changes.set(newUrl, (changes.get(newUrl) || 0) + 1);
    }

    // Apply all changes
    for (const [url, delta] of changes) {
        // Skip if no net change
        if (delta === 0) continue;

        // Find media by URL
        const { data: media, error } = await supabase
            .from('media')
            .select('id, use_count')
            .eq('url', url)
            .single();

        // Skip if media not found (external URL or deleted)
        if (error || !media) {
            console.warn(`Media not found for URL: ${url}`);
            continue;
        }

        // Calculate new count (minimum 0)
        const newCount = Math.max(0, media.use_count + delta);

        // Update media use_count
        await supabase
            .from('media')
            .update({ use_count: newCount })
            .eq('id', media.id);
    }
}

/**
 * Decrement media use_count when content is deleted
 * 
 * @param supabase - Supabase client
 * @param url - Media URL to decrement
 */
export async function decrementMediaUseCount(
    supabase: SupabaseClient,
    url: string | null | undefined
): Promise<void> {
    await updateMediaUseCounts(supabase, url, null);
}
