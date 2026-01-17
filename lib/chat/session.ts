/**
 * Chat Session Management
 * 
 * GDPR-compliant chat session handling with IP hashing
 */

import { createAdminClient } from '../supabase/server';
import { Database } from '../supabase/database.types';

type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

/**
 * Hashes an IP address using SHA-256 with salt
 * 
 * @param ip - IP address to hash
 * @returns Hashed IP address
 */
export async function hashIp(ip: string): Promise<string> {
    const salt = process.env.IP_HASH_SALT || '';
    const data = `${ip}:${salt}`;

    // Use Web Crypto API (available in Node.js 15+ and Edge Runtime)
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/**
 * Gets or creates a chat session for a guest
 * 
 * @param ipHash - Hashed IP address of the guest
 * @returns Chat session
 */
export async function getOrCreateSession(ipHash: string): Promise<ChatSession> {
    const supabase = createAdminClient(); // Use admin client to bypass RLS

    // Try to find an active session (not expired)
    const { data: existingSessions, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('guest_ip_hash', ipHash)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

    if (!fetchError && existingSessions && existingSessions.length > 0) {
        return existingSessions[0];
    }

    // Create new session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day retention

    const { data: newSession, error: createError } = await supabase
        .from('chat_sessions')
        .insert({
            guest_ip_hash: ipHash,
            current_mode: 'auto',
            expires_at: expiresAt.toISOString(),
        } as never)
        .select()
        .single();

    if (createError || !newSession) {
        if (createError) console.error('Create session error:', createError);
        throw new Error('Failed to create chat session');
    }

    return newSession;
}

/**
 * Gets chat session by ID
 * 
 * @param sessionId - Session ID
 * @returns Chat session or null
 */
export async function getSession(sessionId: string): Promise<ChatSession | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    if (error || !data) {
        if (error) console.error('Get session error:', error);
        return null;
    }

    return data;
}

/**
 * Gets chat session by IP
 * 
 * @param ipHash - Hashed IP address
 * @returns Chat session or null
 */
export async function getSessionByIP(ipHash: string): Promise<ChatSession | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('guest_ip_hash', ipHash)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}



/**
 * Gets all messages for a session
 * 
 * @param sessionId - Session ID
 * @returns Array of chat messages
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

    if (error || !data) {
        return [];
    }

    return data;
}

/**
 * Adds a message to a chat session
 * 
 * @param sessionId - Session ID
 * @param senderType - Who sent the message
 * @param content - Message content
 * @returns Created message
 */
export async function addMessage(
    sessionId: string,
    senderType: 'guest' | 'admin' | 'bot',
    content: string
): Promise<ChatMessage> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            session_id: sessionId,
            sender_type: senderType,
            content,
        } as never)
        .select()
        .single();

    if (error || !data) {
        throw new Error('Failed to add message');
    }

    return data;
}

/**
 * Switches chat mode for a session
 * 
 * @param sessionId - Session ID
 * @param mode - New mode ('auto' or 'live')
 * @param adminId - Admin ID (required for 'live' mode)
 * @returns Updated session
 */
export async function switchChatMode(
    sessionId: string,
    mode: 'auto' | 'live',
    adminId?: string
): Promise<ChatSession> {
    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = { current_mode: mode };

    if (mode === 'live') {
        if (!adminId) {
            throw new Error('Admin ID required for live mode');
        }
        updateData.admin_id = adminId;
        updateData.auto_switch_at = null;
    } else {
        updateData.admin_id = null;
    }

    const { data, error } = await supabase
        .from('chat_sessions')
        .update(updateData as never)
        .eq('id', sessionId)
        .select()
        .single();

    if (error || !data) {
        throw new Error('Failed to switch chat mode');
    }

    return data;
}

/**
 * Lists all active chat sessions (for admin panel)
 * 
 * @param filters - Optional filters
 * @returns Array of chat sessions
 */
export async function listActiveSessions(filters?: {
    mode?: 'auto' | 'live';
    adminId?: string;
    page?: number;
    limit?: number;
}): Promise<{ sessions: ChatSession[]; total: number }> {
    const supabase = createAdminClient();
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('chat_sessions')
        .select('*', { count: 'exact' })
        .gt('expires_at', new Date().toISOString());

    if (filters?.mode) {
        query = query.eq('current_mode', filters.mode);
    }

    if (filters?.adminId) {
        query = query.eq('admin_id', filters.adminId);
    }

    query = query
        .order('last_message_at', { ascending: false })
        .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        return { sessions: [], total: 0 };
    }

    return {
        sessions: data || [],
        total: count || 0,
    };
}

/**
 * Cleans up expired chat sessions
 * Should be run via cron job daily
 * 
 * @returns Number of sessions deleted
 */
export async function cleanupExpiredSessions(): Promise<number> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('chat_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select();

    if (error) {
        return 0;
    }

    return data?.length || 0;
}
