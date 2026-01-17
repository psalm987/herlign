/**
 * Centralized API Service
 * Handles all HTTP requests with error handling, authentication, and type safety
 */

import { ApiError, type ApiResponse } from '@/lib/tanstack/types';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Generic fetch wrapper with error handling and JSON parsing
 */
async function fetchApi<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    // Set default headers
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type') && fetchOptions.body) {
        // Don't set Content-Type for FormData (browser sets it with boundary)
        if (!(fetchOptions.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }
    }

    // Make request
    const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include', // Important for cookie-based auth
    });

    // Handle non-OK responses
    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorDetails: unknown;

        try {
            const errorData: ApiResponse<unknown> = await response.json();
            errorMessage = errorData.error || errorMessage;
            errorDetails = errorData.details;
        } catch {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
        }

        throw new ApiError(errorMessage, response.status, errorDetails);
    }

    // Parse successful response
    try {
        return await response.json();
    } catch {
        // If response is not JSON, return empty object
        return {} as T;
    }
}

/**
 * API Service with typed methods
 */
export const api = {
    /**
     * GET request
     */
    get: <T>(endpoint: string, params?: RequestOptions['params']): Promise<T> =>
        fetchApi<T>(endpoint, { method: 'GET', params }),

    /**
     * POST request
     */
    post: <T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> => {
        const isFormData = body instanceof FormData;
        return fetchApi<T>(endpoint, {
            method: 'POST',
            body: isFormData ? body : JSON.stringify(body),
            ...options,
        });
    },

    /**
     * PUT request
     */
    put: <T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> =>
        fetchApi<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...options,
        }),

    /**
     * PATCH request
     */
    patch: <T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> =>
        fetchApi<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            ...options,
        }),

    /**
     * DELETE request
     */
    delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
        fetchApi<T>(endpoint, { method: 'DELETE', ...options }),
};

/**
 * Helper to build query string from object
 */
export function buildQueryString(
    params: Record<string, string | number | boolean | undefined | null>
): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    return searchParams.toString();
}
