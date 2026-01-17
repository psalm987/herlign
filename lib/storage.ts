/**
 * Storage Utilities
 * 
 * Handles file uploads to Supabase Storage with validation
 */

import { createClient } from './supabase/server';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from './validators/media';

const STORAGE_BUCKET = 'media';
const STORAGE_QUOTA_LIMIT = parseInt(process.env.STORAGE_QUOTA_LIMIT || '1073741824'); // 1GB default
const STORAGE_ALERT_THRESHOLD = parseFloat(process.env.STORAGE_ALERT_THRESHOLD || '0.8');

/**
 * Upload result type
 */
export interface UploadResult {
    success: boolean;
    url?: string;
    filename?: string;
    size?: number;
    mime_type?: string;
    error?: string;
}

/**
 * Storage quota info
 */
export interface StorageQuota {
    used: number;
    limit: number;
    percentUsed: number;
    alertThreshold: boolean;
}

/**
 * Uploads a file to Supabase Storage
 * 
 * @param file - File to upload
 * @param adminId - ID of admin uploading the file
 * @returns Upload result with URL or error
 */
export async function uploadFile(
    file: File,
    adminId: string
): Promise<UploadResult> {
    const supabase = await createClient();

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            success: false,
            error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        };
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
        return {
            success: false,
            error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
        };
    }

    // Check storage quota
    const quota = await getStorageQuota();
    if (quota.used + file.size > STORAGE_QUOTA_LIMIT) {
        return {
            success: false,
            error: 'Storage quota exceeded. Please delete unused files.',
        };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filePath = `uploads/${adminId}/${filename}`;

    try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            return {
                success: false,
                error: `Upload failed: ${error.message}`,
            };
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

        return {
            success: true,
            url: publicUrl,
            filename: file.name,
            size: file.size,
            mime_type: file.type,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Deletes a file from Supabase Storage
 * 
 * @param url - Public URL of the file to delete
 * @returns Success status
 */
export async function deleteFile(url: string = ""): Promise<boolean> {
    const supabase = await createClient();

    try {
        // Extract file path from public URL
        const urlParts = url.split(`${STORAGE_BUCKET}/`);
        if (urlParts.length < 2) {
            return false;
        }
        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

        return !error;
    } catch (error: unknown) {
        console.error('Delete file error:', error);
        return false;
    }
}

/**
 * Gets current storage quota usage
 * 
 * @returns Storage quota information
 */
export async function getStorageQuota(): Promise<StorageQuota> {
    const supabase = await createClient();

    try {
        // Get all media files to calculate total size
        const { data, error } = await supabase
            .from('media')
            .select('size');

        if (error) {
            return {
                used: 0,
                limit: STORAGE_QUOTA_LIMIT,
                percentUsed: 0,
                alertThreshold: false,
            };
        }

        const used = data.reduce((total: number, item: { size: number }) => total + item.size, 0);
        const percentUsed = (used / STORAGE_QUOTA_LIMIT) * 100;

        return {
            used,
            limit: STORAGE_QUOTA_LIMIT,
            percentUsed,
            alertThreshold: percentUsed >= STORAGE_ALERT_THRESHOLD * 100,
        };
    } catch (error: unknown) {
        console.error('Storage quota error:', error);
        return {
            used: 0,
            limit: STORAGE_QUOTA_LIMIT,
            percentUsed: 0,
            alertThreshold: false,
        };
    }
}

/**
 * Lists all media files in storage
 * 
 * @param adminId - Optional: filter by admin ID
 * @returns List of file URLs
 */
export async function listFiles(adminId?: string): Promise<string[]> {
    const supabase = await createClient();

    try {
        let query = supabase.from('media').select('url');

        if (adminId) {
            query = query.eq('admin_id', adminId);
        }

        const { data, error } = await query;

        if (error) {
            return [];
        }

        return data.map((item: Record<string, string>) => item.url);
    } catch (error: unknown) {
        console.error('List files error:', error);
        return [];
    }
}
