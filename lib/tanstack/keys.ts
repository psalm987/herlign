/**
 * TanStack Query Keys
 * Centralized query key management for cache consistency
 */

import type {
    EventQuery,
    ResourceQuery,
    TestimonialQuery,
    LinkQuery,
} from '@/lib/tanstack/types';

/**
 * Query key factory for events
 */
export const eventKeys = {
    all: ['events'] as const,
    lists: () => [...eventKeys.all, 'list'] as const,
    list: (filters?: EventQuery) => [...eventKeys.lists(), filters] as const,
    details: () => [...eventKeys.all, 'detail'] as const,
    detail: (id: string, type: "slug" | "id" = "id") => [...eventKeys.details(), type, id] as const,
};

/**
 * Query key factory for admin events
 */
export const adminEventKeys = {
    all: ['admin', 'events'] as const,
    lists: () => [...adminEventKeys.all, 'list'] as const,
    list: (filters?: EventQuery) => [...adminEventKeys.lists(), filters] as const,
    details: () => [...adminEventKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminEventKeys.details(), id] as const,
};

/**
 * Query key factory for resources
 */
export const resourceKeys = {
    all: ['resources'] as const,
    lists: () => [...resourceKeys.all, 'list'] as const,
    list: (filters?: ResourceQuery) =>
        [...resourceKeys.lists(), filters] as const,
    details: () => [...resourceKeys.all, 'detail'] as const,
    detail: (id: string) => [...resourceKeys.details(), id] as const,
};

/**
 * Query key factory for admin resources
 */
export const adminResourceKeys = {
    all: ['admin', 'resources'] as const,
    lists: () => [...adminResourceKeys.all, 'list'] as const,
    list: (filters?: ResourceQuery) =>
        [...adminResourceKeys.lists(), filters] as const,
    details: () => [...adminResourceKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminResourceKeys.details(), id] as const,
};

/**
 * Query key factory for testimonials
 */
export const testimonialKeys = {
    all: ['testimonials'] as const,
    lists: () => [...testimonialKeys.all, 'list'] as const,
    list: (filters?: TestimonialQuery) =>
        [...testimonialKeys.lists(), filters] as const,
    details: () => [...testimonialKeys.all, 'detail'] as const,
    detail: (id: string) => [...testimonialKeys.details(), id] as const,
};

/**
 * Query key factory for admin testimonials
 */
export const adminTestimonialKeys = {
    all: ['admin', 'testimonials'] as const,
    lists: () => [...adminTestimonialKeys.all, 'list'] as const,
    list: (filters?: TestimonialQuery) =>
        [...adminTestimonialKeys.lists(), filters] as const,
    details: () => [...adminTestimonialKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminTestimonialKeys.details(), id] as const,
};

/**
 * Query key factory for links
 */
export const linkKeys = {
    all: ['links'] as const,
    lists: () => [...linkKeys.all, 'list'] as const,
    list: (filters?: LinkQuery) => [...linkKeys.lists(), filters] as const,
    details: () => [...linkKeys.all, 'detail'] as const,
    detail: (id: string) => [...linkKeys.details(), id] as const,
};

/**
 * Query key factory for admin links
 */
export const adminLinkKeys = {
    all: ['admin', 'links'] as const,
    lists: () => [...adminLinkKeys.all, 'list'] as const,
    list: (filters?: LinkQuery) => [...adminLinkKeys.lists(), filters] as const,
    details: () => [...adminLinkKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminLinkKeys.details(), id] as const,
};

/**
 * Query key factory for media
 */
export const mediaKeys = {
    all: ['admin', 'media'] as const,
    lists: () => [...mediaKeys.all, 'list'] as const,
    list: (filters?: { is_used?: boolean; page?: number; limit?: number }) =>
        [...mediaKeys.lists(), filters] as const,
    unused: () => [...mediaKeys.all, 'unused'] as const,
};

/**
 * Query key factory for chat (public)
 */
export const chatKeys = {
    all: ['chat'] as const,
    history: () => [...chatKeys.all, 'history'] as const,
};

/**
 * Query key factory for admin chat
 */
export const adminChatKeys = {
    all: ['admin', 'chat'] as const,
    sessions: () => [...adminChatKeys.all, 'sessions'] as const,
    sessionsList: (filters?: { mode?: 'auto' | 'live'; page?: number; limit?: number }) =>
        [...adminChatKeys.sessions(), filters] as const,
    sessionDetail: (id: string) => [...adminChatKeys.sessions(), id] as const,
};

/**
 * Query key factory for authentication
 */
export const authKeys = {
    all: ['auth'] as const,
    session: () => [...authKeys.all, 'session'] as const,
};

/**
 * Helper to invalidate all related queries when an entity changes
 */
export const invalidationGroups = {
    events: {
        public: eventKeys.all,
        admin: adminEventKeys.all,
    },
    resources: {
        public: resourceKeys.all,
        admin: adminResourceKeys.all,
    },
    testimonials: {
        public: testimonialKeys.all,
        admin: adminTestimonialKeys.all,
    },
    links: {
        public: linkKeys.all,
        admin: adminLinkKeys.all,
    },
    media: mediaKeys.all,
    chat: {
        public: chatKeys.all,
        admin: adminChatKeys.all,
    },
    auth: authKeys.all,
};
