# TanStack Query Architecture Documentation

Complete implementation of TanStack Query for the Herlign platform with actions, services, and hooks.

## 📁 Project Structure

```
lib/
├── actions/                    # API action functions
│   ├── auth.ts                # Authentication actions
│   ├── events.ts              # Events CRUD actions
│   ├── resources.ts           # Resources CRUD actions
│   ├── testimonials.ts        # Testimonials CRUD actions
│   ├── links.ts               # Links CRUD actions
│   ├── media.ts               # Media upload/management actions
│   └── chat.ts                # Chat actions (public & admin)
├── services/
│   └── api.ts                 # Centralized fetch wrapper with error handling
├── tanstack/
│   ├── types.ts               # Shared TypeScript types
│   ├── keys.ts                # Query key management
│   ├── provider.tsx           # QueryClient provider
│   └── hooks/
│       ├── useAuth.tsx        # Auth hooks
│       ├── useEvents.tsx      # Public events hooks
│       ├── useResources.tsx   # Public resources hooks
│       ├── useTestimonials.tsx # Public testimonials hooks
│       ├── useLinks.tsx       # Public links hooks
│       ├── useChat.tsx        # Public chat hooks
│       └── admin/
│           ├── useEvents.tsx      # Admin events hooks with CRUD
│           ├── useResources.tsx   # Admin resources hooks with CRUD
│           ├── useTestimonials.tsx # Admin testimonials hooks with CRUD
│           ├── useLinks.tsx       # Admin links hooks with CRUD
│           ├── useMedia.tsx       # Admin media hooks
│           └── useChat.tsx        # Admin chat session management
```

## 🎯 Layer Architecture

### 1. Actions Layer (`lib/actions/`)

Low-level functions that call API endpoints. Each action file contains:

- Public API calls (no auth required)
- Admin API calls (requires authentication)

**Example:**

```typescript
// lib/actions/events.ts
export async function getEvents(params?: EventQuery) {
  return api.get<PaginatedResponse<Event>>("/api/events", params);
}

export async function createEvent(data: EventInput) {
  return api.post<ApiResponse<Event>>("/api/admin/events", data);
}
```

### 2. Services Layer (`lib/services/api.ts`)

Centralized HTTP client that wraps `fetch` with:

- ✅ Automatic JSON parsing
- ✅ Error handling with custom `ApiError` class
- ✅ Cookie-based authentication support
- ✅ Query parameter serialization
- ✅ Type-safe requests/responses

**Features:**

```typescript
// GET with query params
api.get("/api/events", { page: 1, limit: 20 });

// POST with JSON body
api.post("/api/admin/events", eventData);

// Automatic error handling
try {
  const data = await api.get("/api/events");
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.statusCode); // 404, 500, etc.
  }
}
```

### 3. Hooks Layer (`lib/tanstack/hooks/`)

TanStack Query hooks with generic options support:

**Public Hooks** - Read-only access:

- `useEvents()` - Get published events
- `useResources()` - Get resources
- `useTestimonials()` - Get approved testimonials
- `useLinks()` - Get links
- `useChatHistory()` - Get chat history
- `useSession()` - Check auth session

**Admin Hooks** - Full CRUD:

- `useAdminEvents()` + `useCreateEvent()` + `useUpdateEvent()` + `useDeleteEvent()`
- `useAdminResources()` + `useCreateResource()` + `useUpdateResource()` + `useDeleteResource()`
- `useAdminTestimonials()` + `useCreateTestimonial()` + `useUpdateTestimonial()` + `useDeleteTestimonial()` + `useApproveTestimonial()`
- `useAdminLinks()` + `useCreateLink()` + `useUpdateLink()` + `useDeleteLink()`
- `useAdminMedia()` + `useUploadMedia()` + `useDeleteMedia()` + `useUnusedMedia()`
- `useAdminChatSessions()` + `useAdminChatSession()` + `useSendAdminChatMessage()` + `useSwitchChatMode()`

## 🔑 Key Features

### Generic Hook Options

All hooks accept custom options for `onSuccess`, `onError`, `onSettled`:

```typescript
const { mutate } = useCreateEvent({
  onSuccess: (data) => {
    toast.success("Event created!");
    router.push(`/admin/events/${data.data?.id}`);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const { data } = useEvents(
  { page: 1, limit: 20 },
  {
    onSuccess: (data) => console.log("Events loaded:", data),
    refetchInterval: 30000, // Refetch every 30s
  },
);
```

### Optimistic Updates

Admin mutation hooks include optimistic updates for better UX:

```typescript
const { mutate: updateEvent } = useUpdateEvent({
  onSuccess: () => toast.success("Event updated!"),
});

// UI updates immediately, rolls back on error
updateEvent({ id: eventId, data: { title: "New Title" } });
```

### Automatic Cache Invalidation

Mutations automatically invalidate related queries:

```typescript
// Creating an event invalidates both admin and public event lists
useCreateEvent(); // Auto-invalidates eventKeys.all + adminEventKeys.all

// Approving a testimonial invalidates both admin and public testimonial lists
useApproveTestimonial(); // Auto-invalidates testimonialKeys.all + adminTestimonialKeys.all
```

### Smart Query Keys

Query keys are organized for granular cache control:

```typescript
// lib/tanstack/keys.ts
eventKeys.all; // ['events']
eventKeys.lists(); // ['events', 'list']
eventKeys.list({ page: 1 }); // ['events', 'list', { page: 1 }]
eventKeys.detail(id); // ['events', 'detail', id]

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: eventKeys.all }); // All events
queryClient.invalidateQueries({ queryKey: eventKeys.lists() }); // All lists only
```

### Pagination Support

All list queries return paginated responses:

```typescript
const { data } = useEvents({ page: 1, limit: 20 });

// Access pagination info
data?.pagination.page; // 1
data?.pagination.total; // 45
data?.pagination.totalPages; // 3
data?.pagination.hasNext; // true
```

### DevTools Integration

React Query DevTools enabled in development:

```typescript
// Automatically included in QueryProvider
// Access via button in bottom-right corner
// View all queries, mutations, cache state, etc.
```

## 💡 Usage Examples

### Example 1: Public Events List

```tsx
"use client";

import { useEvents } from "@/lib/tanstack/hooks/useEvents";

export function EventsList() {
  const { data, isLoading, error } = useEvents(
    { status: "published", page: 1, limit: 10 },
    {
      staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

### Example 2: Admin Event Creation

```tsx
"use client";

import { useCreateEvent } from "@/lib/tanstack/hooks/admin/useEvents";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your toast library

export function CreateEventForm() {
  const router = useRouter();
  const { mutate: createEvent, isPending } = useCreateEvent({
    onSuccess: (response) => {
      toast.success("Event created successfully!");
      router.push(`/admin/events/${response.data?.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  const handleSubmit = (formData: EventInput) => {
    createEvent(formData);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(/* form data */);
      }}
    >
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
```

### Example 3: Optimistic Updates

```tsx
"use client";

import { useUpdateEvent } from "@/lib/tanstack/hooks/admin/useEvents";

export function EventStatusToggle({ event }) {
  const { mutate: updateEvent, isPending } = useUpdateEvent({
    onError: (error) => {
      toast.error("Failed to update event");
    },
  });

  const toggleStatus = () => {
    // UI updates immediately, rolls back on error
    updateEvent({
      id: event.id,
      data: {
        status: event.status === "published" ? "draft" : "published",
      },
    });
  };

  return (
    <button onClick={toggleStatus} disabled={isPending}>
      {event.status}
    </button>
  );
}
```

### Example 4: Authentication

```tsx
"use client";

import { useLogin, useSession, useLogout } from "@/lib/tanstack/hooks/useAuth";

export function AuthExample() {
  const { data: session } = useSession();
  const { mutate: login } = useLogin({
    onSuccess: () => toast.success("Logged in!"),
  });
  const { mutate: logout } = useLogout({
    onSuccess: () => toast.success("Logged out!"),
  });

  if (session?.authenticated) {
    return (
      <div>
        Welcome, {session.user?.email}
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => login({ email: "...", password: "..." })}>
      Login
    </button>
  );
}
```

### Example 5: File Upload

```tsx
"use client";

import { useUploadMedia } from "@/lib/tanstack/hooks/admin/useMedia";

export function MediaUploader() {
  const { mutate: uploadFile, isPending } = useUploadMedia({
    onSuccess: (response) => {
      toast.success("File uploaded!");
      console.log("URL:", response.data.url);
      console.log("Quota:", response.quota.percentUsed);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile({ file, alt_text: "My image" });
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileSelect}
      disabled={isPending}
      accept="image/jpeg,image/png,image/webp,image/svg+xml"
    />
  );
}
```

### Example 6: Chat Integration

```tsx
"use client";

import {
  useSendChatMessage,
  useChatHistory,
} from "@/lib/tanstack/hooks/useChat";

export function ChatWidget() {
  const { data: history } = useChatHistory();
  const { mutate: sendMessage } = useSendChatMessage({
    onSuccess: () => {
      // Message sent, history will auto-refetch
    },
  });

  const handleSend = (message: string) => {
    sendMessage({ message });
  };

  return (
    <div>
      <div>
        {history?.messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
```

## ⚙️ Configuration

### QueryClient Settings

Default configuration in `lib/tanstack/provider.tsx`:

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,          // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,      // Refetch on tab focus
    refetchOnReconnect: true,        // Refetch on reconnect
    retry: 3,                        // Retry failed requests 3x
  },
  mutations: {
    retry: 1,                        // Retry mutations once on network errors
  }
}
```

### Custom Configuration Per Hook

Override defaults on any hook:

```typescript
const { data } = useEvents(
  { page: 1 },
  {
    staleTime: 0, // Always consider stale
    refetchOnMount: true, // Always refetch on mount
    refetchInterval: 10000, // Poll every 10s
    enabled: someCondition, // Conditional fetching
  },
);
```

## 🧪 Testing

Example test setup:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useEvents } from '@/lib/tanstack/hooks/useEvents';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('useEvents fetches events', async () => {
  const { result } = renderHook(() => useEvents(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data).toBeDefined();
});
```

## 🚀 Best Practices

1. **Use optimistic updates** for instant UI feedback on mutations
2. **Leverage query keys** for granular cache invalidation
3. **Pass custom options** from components for flexibility
4. **Handle loading/error states** in components, not hooks
5. **Use enabled option** to conditionally fetch data
6. **Leverage staleTime** to reduce unnecessary refetches
7. **Monitor DevTools** in development to debug cache issues

## 📖 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [API Documentation](../API.md)
- [Setup Guide](../SETUP.md)

---

**Architecture implemented by**: GitHub Copilot
**Date**: January 17, 2026
