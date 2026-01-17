/**
 * TanStack Query Provider
 * Configures QueryClient with optimal settings for the app
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

/**
 * Default query client configuration
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes (data considered fresh for 5 min)
        staleTime: 5 * 60 * 1000,
        // Cache time: 10 minutes (unused data kept in cache for 10 min)
        gcTime: 10 * 60 * 1000,
        // Retry failed requests 3 times with exponential backoff
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error && "statusCode" in error) {
            const statusCode = (error as { statusCode?: number }).statusCode;
            if (statusCode && statusCode >= 400 && statusCode < 500) {
              return false;
            }
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Refetch on reconnect
        refetchOnReconnect: true,
        // Don't refetch on mount if data is still fresh
        refetchOnMount: false,
      },
      mutations: {
        // Retry mutations once on network errors
        retry: (failureCount, error) => {
          // Only retry on network errors
          if (error instanceof Error && error.message.includes("network")) {
            return failureCount < 1;
          }
          return false;
        },
      },
    },
  });
}

// Browser-only QueryClient instance
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse existing client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * TanStack Query Provider Component
 * Wrap your app with this to enable query/mutation hooks
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Use useState to ensure client is only created once
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show DevTools in development only */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

/**
 * Export QueryClient for advanced use cases
 */
export { getQueryClient };
