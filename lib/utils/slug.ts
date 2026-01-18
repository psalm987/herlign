/**
 * Slug Generation Utilities
 * 
 * Generates URL-safe slugs from event titles with the following rules:
 * - Maximum 20 characters
 * - Minimum 6 characters
 * - Stops at special characters: ():!#,.\?&@$%^*+=[]{};"'|<>/\
 * - Adds 3-digit random number for uniqueness
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Generates a URL-safe slug from a title
 * 
 * @param title - The title to convert to a slug
 * @returns A slug (max 20 chars, min 6 chars)
 */
export function generateSlugFromTitle(title: string): string {
    // Remove special characters and replace with spaces
    let slug = title
        .toLowerCase()
        .replace(/[():!#,.\?&@$%^*+=\[\]{};'"|<>/\\]+/g, ' ')
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Limit to max 20 characters (leaving room for -XXX suffix)
    // We'll reserve 4 chars for the random number suffix (-XXX)
    const maxBaseLength = 16;

    if (slug.length > maxBaseLength) {
        slug = slug.substring(0, maxBaseLength);
        // Remove trailing hyphen if cut-off created one
        slug = slug.replace(/-+$/, '');
    }

    // Ensure minimum length of 6 characters before adding number
    if (slug.length < 6) {
        // Pad with event prefix if too short
        slug = `event-${slug}`.substring(0, maxBaseLength);
    }

    // Add 3-digit random number for variation
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    slug = `${slug}-${randomNum}`;

    return slug;
}

/**
 * Generates a unique slug for an event
 * Checks database for duplicates and regenerates if needed
 * 
 * @param title - The event title
 * @param excludeId - Optional event ID to exclude from uniqueness check (for updates)
 * @returns A unique slug
 */
export async function generateUniqueSlug(
    title: string,
    excludeId?: string
): Promise<string> {
    const supabase = await createClient();
    let slug = generateSlugFromTitle(title);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        // Check if slug exists
        let query = supabase
            .from('events')
            .select('id')
            .eq('slug', slug);

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data, error } = await query.single();

        // If no match found (error is returned when no rows), slug is unique
        if (error || !data) {
            return slug;
        }

        // Slug exists, generate a new one
        slug = generateSlugFromTitle(title);
        attempts++;
    }

    // Fallback: add timestamp if all attempts failed
    const timestamp = Date.now().toString().slice(-6);
    return `${slug.substring(0, 14)}-${timestamp}`;
}

/**
 * Validates a slug format
 * 
 * @param slug - The slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
    // Must be 6-20 characters
    if (slug.length < 6 || slug.length > 20) {
        return false;
    }

    // Must only contain lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
        return false;
    }

    // Must not start or end with a hyphen
    if (slug.startsWith('-') || slug.endsWith('-')) {
        return false;
    }

    return true;
}
