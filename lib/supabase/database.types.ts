/**
 * Database TypeScript Types
 * 
 * Auto-generated types for the Supabase database schema.
 * 
 * To regenerate these types:
 * 1. Install Supabase CLI: npm i -g supabase
 * 2. Login: supabase login
 * 3. Generate types: supabase gen types typescript --project-id <your-project-id> > lib/supabase/database.types.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            events: {
                Row: {
                    id: string;
                    type: 'event' | 'workshop';
                    mode: 'live' | 'online';
                    title: string;
                    slug: string;
                    description: string;
                    external_link: string | null;
                    start_date: string;
                    end_date: string;
                    max_attendees: number | null;
                    image_url: string | null;
                    price: number;
                    is_paid: boolean;
                    status: 'draft' | 'published' | 'cancelled';
                    featured: boolean;
                    admin_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    type: 'event' | 'workshop';
                    mode: 'live' | 'online';
                    title: string;
                    slug?: string;
                    description: string;
                    external_link?: string | null;
                    start_date: string;
                    end_date: string;
                    max_attendees?: number | null;
                    image_url?: string | null;
                    price?: number;
                    is_paid?: boolean;
                    status?: 'draft' | 'published' | 'cancelled';
                    featured?: boolean;
                    admin_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    type?: 'event' | 'workshop';
                    mode?: 'live' | 'online';
                    title?: string;
                    slug?: string;
                    description?: string;
                    external_link?: string | null;
                    start_date?: string;
                    end_date?: string;
                    max_attendees?: number | null;
                    image_url?: string | null;
                    price?: number;
                    is_paid?: boolean;
                    status?: 'draft' | 'published' | 'cancelled';
                    featured?: boolean;
                    admin_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            resources: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    external_link: string;
                    format: 'ebook' | 'guide' | 'template';
                    category: string;
                    tags: string[];
                    price: number;
                    is_paid: boolean;
                    admin_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description: string;
                    external_link: string;
                    format: 'ebook' | 'guide' | 'template';
                    category: string;
                    tags?: string[];
                    price?: number;
                    is_paid?: boolean;
                    admin_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string;
                    external_link?: string;
                    format?: 'ebook' | 'guide' | 'template';
                    category?: string;
                    tags?: string[];
                    price?: number;
                    is_paid?: boolean;
                    admin_id?: string;
                    created_at?: string;
                };
            };
            testimonials: {
                Row: {
                    id: string;
                    rating: number | null;
                    avatar_url: string | null;
                    review: string;
                    reviewer_name: string;
                    reviewer_title: string | null;
                    is_approved: boolean;
                    admin_id: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    rating?: number | null;
                    avatar_url?: string | null;
                    review: string;
                    reviewer_name: string;
                    reviewer_title?: string | null;
                    is_approved?: boolean;
                    admin_id?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    rating?: number | null;
                    avatar_url?: string | null;
                    review?: string;
                    reviewer_name?: string;
                    reviewer_title?: string | null;
                    is_approved?: boolean;
                    admin_id?: string | null;
                    created_at?: string;
                };
            };
            links: {
                Row: {
                    id: string;
                    name: string;
                    href: string;
                    category: string;
                    admin_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    href: string;
                    category: string;
                    admin_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    href?: string;
                    category?: string;
                    admin_id?: string;
                    created_at?: string;
                };
            };
            media: {
                Row: {
                    id: string;
                    filename: string;
                    url: string;
                    alt_text: string | null;
                    size: number;
                    mime_type: string;
                    use_count: number;
                    admin_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    filename: string;
                    url: string;
                    alt_text?: string | null;
                    size: number;
                    mime_type: string;
                    use_count?: number;
                    admin_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    filename?: string;
                    url?: string;
                    alt_text?: string | null;
                    size?: number;
                    mime_type?: string;
                    use_count?: number;
                    admin_id?: string;
                    created_at?: string;
                };
            };
            chat_sessions: {
                Row: {
                    id: string;
                    guest_ip_hash: string;
                    current_mode: 'auto' | 'live';
                    admin_id: string | null;
                    last_message_at: string;
                    auto_switch_at: string | null;
                    created_at: string;
                    expires_at: string;
                };
                Insert: {
                    id?: string;
                    guest_ip_hash: string;
                    current_mode?: 'auto' | 'live';
                    admin_id?: string | null;
                    last_message_at?: string;
                    auto_switch_at?: string | null;
                    created_at?: string;
                    expires_at?: string;
                };
                Update: {
                    id?: string;
                    guest_ip_hash?: string;
                    current_mode?: 'auto' | 'live';
                    admin_id?: string | null;
                    last_message_at?: string;
                    auto_switch_at?: string | null;
                    created_at?: string;
                    expires_at?: string;
                };
            };
            chat_messages: {
                Row: {
                    id: string;
                    session_id: string;
                    sender_type: 'guest' | 'admin' | 'bot';
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    sender_type: 'guest' | 'admin' | 'bot';
                    content: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    session_id?: string;
                    sender_type?: 'guest' | 'admin' | 'bot';
                    content?: string;
                    created_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            cleanup_expired_chat_sessions: {
                Args: Record<string, never>;
                Returns: void;
            };
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
