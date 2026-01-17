/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiter for protecting endpoints
 * Suitable for Vercel serverless functions
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store (resets on function cold start)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    /**
     * Maximum number of requests allowed in the time window
     */
    limit: number;

    /**
     * Time window in seconds
     */
    windowSeconds: number;
}

export interface RateLimitResult {
    /**
     * Whether the request is allowed
     */
    allowed: boolean;

    /**
     * Current request count
     */
    count: number;

    /**
     * Maximum requests allowed
     */
    limit: number;

    /**
     * Seconds until rate limit resets
     */
    resetIn: number;
}

/**
 * Checks if a request is within rate limits
 * 
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const key = identifier;

    let entry = rateLimitStore.get(key);

    // Create new entry if doesn't exist or expired
    if (!entry || entry.resetAt < now) {
        entry = {
            count: 0,
            resetAt: now + windowMs,
        };
        rateLimitStore.set(key, entry);
    }

    // Increment count
    entry.count++;

    const allowed = entry.count <= config.limit;
    const resetIn = Math.ceil((entry.resetAt - now) / 1000);

    return {
        allowed,
        count: entry.count,
        limit: config.limit,
        resetIn: Math.max(0, resetIn),
    };
}

/**
 * Gets client IP address from request headers
 * 
 * @param request - Next.js request object
 * @returns IP address or fallback identifier
 */
export function getClientIp(request: Request): string {
    // Try various headers (Vercel sets x-forwarded-for)
    const headers = Object.fromEntries(request.headers.entries());

    return (
        headers['x-forwarded-for']?.split(',')[0] ||
        headers['x-real-ip'] ||
        headers['cf-connecting-ip'] || // Cloudflare
        'unknown'
    );
}

/**
 * Preset rate limit configurations
 */
export const RATE_LIMITS = {
    /**
     * For chat messages: 10 per minute
     */
    CHAT: { limit: 10, windowSeconds: 60 },

    /**
     * For file uploads: 5 per minute
     */
    UPLOAD: { limit: 5, windowSeconds: 60 },

    /**
     * For general API: 100 per minute
     */
    API: { limit: 100, windowSeconds: 60 },

    /**
     * For authentication: 5 per 5 minutes
     */
    AUTH: { limit: 5, windowSeconds: 300 },
} as const;
