# Herlign FC Website - AI Coding Agent Instructions

## Architecture Overview

**Hybrid Next.js 16 App Router** project with frontend (Tailwind CSS v4, shadcn/ui) and backend API (Supabase).

- **Frontend**: TypeScript, React 19, React Compiler enabled, custom brand system
- **Backend**: Supabase PostgreSQL + Auth + Storage, Zod validation, RLS security
- **API Structure**: RESTful with `/api/auth`, `/api/admin/*` (protected), `/api/*` (public), `/api/chat`
- **Deployment Target**: Vercel with edge runtime optimization

## Brand System Implementation

### Custom Color Tokens

Five brand colors with full Tailwind scale (50-950 + DEFAULT):

- **grin** (`#4C7F0E`) - Primary green
- **peenk** (`#ECAFF2`) - Pink accent
- **ohrange** (`#EC661C`) - Orange accent
- **perple** (`#8048F7`) - Purple accent
- **lermorn** (`#B4C96E`) - Lime accent

Colors are defined as CSS variables in `app/globals.css` and referenced in `tailwind.config.ts`. Use full variant syntax: `bg-grin-500`, `text-perple-600`, `border-ohrange-300`.

**Example usage** (see `app/page.tsx`):

```tsx
<h1 className="font-heading text-6xl text-grin-600">Welcome</h1>
<p className="font-handwriting text-3xl text-perple-500">Subtitle</p>
```

### Custom Font System

Three locally-hosted fonts configured in `app/fonts.ts` with CSS variables:

- **Axiforma** - Body text with 13 weights (100-950), use `font-sans`
- **Clash Display** - Headings with 6 weights (200-700), use `font-heading`
- **Gochi Hand** - Decorative, single weight, use `font-handwriting`

Fonts applied globally in `app/layout.tsx` via `className={axiforma.variable}` pattern. All font files in `public/fonts/`.

## Development Workflow

### Starting Development

```bash
npm run dev  # Runs on http://localhost:3000
```

A VS Code task "dev" exists and can be run with the run_task tool.

### Adding shadcn/ui Components

Project configured with shadcn/ui "new-york" style. Use:

```bash
npx shadcn@latest add [component-name]
```

Components install to `@/components/ui` (alias configured in `components.json`). Use the `cn()` utility from `lib/utils.ts` for conditional classes.

## Project-Specific Conventions

### Styling Patterns

- Tailwind v4 with CSS-first approach (`@import "tailwindcss"` in `app/globals.css`)
- Animation utilities via `tw-animate-css` package
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- All theme tokens defined in `@theme inline` block in globals.css

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to project root
- Target ES2017 with module bundler resolution

### Component Structure

Currently minimal - just the homepage in `app/page.tsx`. When creating new components:

- Place reusable components in `components/` (not yet created)
- Use shadcn/ui components via `@/components/ui` alias
- Server components by default (App Router convention)

## Key Files

### Frontend

- `app/fonts.ts` - Font configuration exports (`axiforma`, `clashDisplay`, `gochiHand`)
- `app/globals.css` - Theme tokens, color variables, Tailwind v4 imports
- `tailwind.config.ts` - Color scale mapping and font family tokens
- `components.json` - shadcn/ui configuration
- `lib/utils.ts` - `cn()` utility for class merging

### Backend/API

- `lib/supabase/server.ts` - Server Supabase client (use `await createClient()`)
- `lib/supabase/client.ts` - Browser Supabase client
- `lib/supabase/database.types.ts` - Auto-generated database types
- `lib/validators/*` - Zod schemas for all entities (events, resources, testimonials, links, chat, media)
- `lib/auth.ts` - Auth helpers (`requireAuth()`, `getAuthUser()`)
- `middleware.ts` - Route protection (auto-guards `/api/admin/*`)
- `supabase/schema.sql` - Complete database schema with RLS policies

## Backend API Architecture

### Critical Pattern: Async Supabase Client

**IMPORTANT**: Supabase clients are now async in Next.js 16. Always await:

```typescript
// ✅ CORRECT
const supabase = await createClient();
const user = await requireAuth();

// ❌ WRONG - will cause runtime errors
const supabase = createClient(); // Missing await!
```

All API routes must handle this. See [app/api/admin/events/route.ts](../app/api/admin/events/route.ts) for reference.

### Authentication Flow

1. **Middleware** ([middleware.ts](../middleware.ts)): Auto-protects `/api/admin/*` routes
2. **Auth Helpers** ([lib/auth.ts](../lib/auth.ts)):
   - `requireAuth()` - Throws error if not authenticated (use in admin routes)
   - `getAuthUser()` - Returns user or null (use for conditional logic)
3. **Login/Logout**: Standard Supabase Auth via cookies ([app/api/auth/](../app/api/auth/))

Example admin route pattern:

```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(); // Protected
    const supabase = await createClient(); // Await!

    const body = await request.json();
    const validation = schema.safeParse(body); // Zod validation

    // ... insert with admin_id: user.id
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

### Validation Pattern

**Always validate with Zod before database operations**:

```typescript
import { eventSchema } from "@/lib/validators/events";

const validation = eventSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    { error: "Validation failed", details: validation.error.message },
    { status: 400 },
  );
}

const eventData = { ...validation.data, admin_id: user.id };
```

Validators in `lib/validators/` include schemas for create, update, and query params. Use type exports:

```typescript
import { EventInput, EventUpdate, EventQuery } from "@/lib/validators/events";
```

### Database Access Patterns

**Row Level Security (RLS)**: All tables have RLS enabled. Key policies:

- Public reads: Published events, approved testimonials, all resources/links
- Admin writes: Own content only (enforced by `admin_id` check)
- Chat: Session isolation by hashed IP

**Standard CRUD Pattern** (see [app/api/admin/events/](../app/api/admin/events/)):

```typescript
// List with pagination
let query = supabase.from("table").select("*", { count: "exact" });
query = query.eq("field", value); // Add filters
query = query.range(offset, offset + limit - 1);

// Create
const { data, error } = await supabase
  .from("table")
  .insert({ ...validated, admin_id: user.id })
  .select()
  .single();

// Update (enforce ownership)
await supabase.from("table").update(data).eq("id", id).eq("admin_id", user.id); // Critical!

// Delete (enforce ownership)
await supabase.from("table").delete().eq("id", id).eq("admin_id", user.id);
```

### Special Systems

**File Upload** ([lib/storage.ts](../lib/storage.ts)):

- 5MB limit, allowed types: jpg, png, webp, svg
- `uploadFile(file, adminId)` handles validation + quota check
- Stores metadata in `media` table + Supabase Storage bucket 'media'

**Chat System** ([lib/chat/](../lib/chat/)):

- GDPR-compliant: IP hashing with SHA-256 + salt
- Two modes: `auto` (AI bot) or `live` (admin responds)
- 30-day retention, auto-cleanup via cron
- AI providers: OpenAI, Gemini, or DeepSeek (env-configured)
- See [app/api/chat/message/route.ts](../app/api/chat/message/route.ts) for flow

**Rate Limiting** ([lib/rate-limit.ts](../lib/rate-limit.ts)):

- In-memory store (use Redis for production)
- `checkRateLimit(identifier, config)` returns `{ allowed, count, resetIn }`
- Presets: `RATE_LIMITS.CHAT` (10/min), `RATE_LIMITS.UPLOAD` (5/min), `RATE_LIMITS.AUTH` (5/5min)

## API Route Structure

```
/api
├── auth/                    # Public: login, logout, session
├── admin/                   # Protected: all require authentication
│   ├── events/             # CRUD + list with filters
│   ├── resources/          # CRUD + tag search
│   ├── testimonials/       # CRUD + approve endpoint
│   ├── links/              # CRUD
│   ├── media/              # Upload, list, delete, unused
│   └── chat/sessions/      # List, view, respond, switch mode
├── events/                  # Public: published events with caching
├── resources/               # Public: all resources with caching
├── testimonials/            # Public: approved only with caching
├── links/                   # Public: all links with caching
└── chat/                    # Public: message (guest), history
```

**Public endpoints** use `revalidate = 300` (5-minute cache):

```typescript
export const dynamic = "force-dynamic";
export const revalidate = 300;
```

## Environment Variables

Required in `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key

# AI Provider (Choose ONE at a time)
# OpenAI - https://platform.openai.com/api-keys
# OPENAI_API_KEY=

# Google Gemini - https://makersuite.google.com/app/apikey
# GEMINI_API_KEY=

# DeepSeek - https://platform.deepseek.com
# DEEPSEEK_API_KEY=

# Application Security
# Generate a random salt: openssl rand -base64 32
IP_HASH_SALT=

# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Storage Quota (in bytes, default: 1GB)
STORAGE_QUOTA_LIMIT=1073741824
STORAGE_ALERT_THRESHOLD=0.8
```

## Development Workflows

### Setup New Features

1. **Database first**: Update [supabase/schema.sql](../supabase/schema.sql) with table + RLS policies
2. **Types**: Regenerate types or manually update [lib/supabase/database.types.ts](../lib/supabase/database.types.ts)
3. **Validators**: Create Zod schema in `lib/validators/`
4. **API routes**: Follow CRUD pattern from existing routes
5. **Test**: Use curl or Postman (see [API.md](../API.md) for examples)

### Common Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run lint             # ESLint check

# Add shadcn component (frontend)
npx shadcn@latest add [component-name]

# Generate Supabase types (requires CLI)
supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
```

### Debugging Auth Issues

1. Check Supabase Dashboard > Authentication > Users (user confirmed?)
2. Verify cookies in browser DevTools (should see `sb-access-token`)
3. Test session: `curl http://localhost:3000/api/auth/session` (should show authenticated)
4. Middleware logs: Check terminal for 401 errors

### Testing API Endpoints

```bash
# Login (saves cookie in -c flag)
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Use authenticated endpoint
curl -b cookies.txt http://localhost:3000/api/admin/events

# Public endpoint (no auth)
curl http://localhost:3000/api/events
```

## TanStack Query Architecture

### Layer Structure

The project uses a 3-layer architecture for data fetching:

1. **Actions Layer** (`lib/actions/`) - Low-level API calls
2. **Services Layer** (`lib/services/api.ts`) - Centralized HTTP client
3. **Hooks Layer** (`lib/tanstack/hooks/`) - React Query hooks

**File Structure:**

```
lib/
├── actions/              # API action functions
│   ├── auth.ts
│   ├── events.ts
│   ├── resources.ts
│   ├── testimonials.ts
│   ├── links.ts
│   ├── media.ts
│   └── chat.ts
├── services/
│   └── api.ts           # Fetch wrapper with error handling
├── tanstack/
│   ├── types.ts         # Shared TypeScript types
│   ├── keys.ts          # Query key management
│   ├── provider.tsx     # QueryClient provider
│   └── hooks/
│       ├── useAuth.tsx
│       ├── useEvents.tsx
│       ├── useResources.tsx
│       ├── useTestimonials.tsx
│       ├── useLinks.tsx
│       ├── useChat.tsx
│       └── admin/       # Admin-only hooks with CRUD
```

### Using TanStack Query Hooks

**Public Hooks** (read-only):

```typescript
import { useEvents } from "@/lib/tanstack/hooks/useEvents";

const { data, isLoading, error } = useEvents(
  { status: "published", page: 1, limit: 10 },
  {
    onSuccess: (data) => console.log("Loaded:", data),
    staleTime: 5 * 60 * 1000,
  },
);
```

**Admin Hooks** (full CRUD with optimistic updates):

```typescript
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/lib/tanstack/hooks/admin/useEvents";

// Create
const { mutate: createEvent } = useCreateEvent({
  onSuccess: () => toast.success("Created!"),
  onError: (error) => toast.error(error.message),
});

// Update (with optimistic updates)
const { mutate: updateEvent } = useUpdateEvent({
  onSuccess: () => toast.success("Updated!"),
});

// Delete (with optimistic updates)
const { mutate: deleteEvent } = useDeleteEvent();
```

### TanStack Query Features

- ✅ **Automatic cache invalidation** - Mutations invalidate related queries
- ✅ **Optimistic updates** - UI updates immediately, rolls back on error
- ✅ **Generic hook options** - Pass `onSuccess`, `onError`, `onSettled` from components
- ✅ **Smart query keys** - Granular cache control
- ✅ **Pagination support** - All list queries return paginated responses
- ✅ **DevTools** - React Query DevTools enabled in development

### Best Practices

1. **Spread options first** in mutation hooks:

   ```typescript
   return useMutation({
     ...options,          // User options first
     mutationFn: action,  // Override mutationFn
     onSuccess: (data, variables, context) => {
       options?.onSuccess?.(data, variables, context);  // User callback first
       queryClient.invalidateQueries(...);  // Then internal logic
     },
   });
   ```

2. **Use query keys** from `lib/tanstack/keys.ts` for cache operations
3. **Handle loading/error states** in components, not hooks
4. **Leverage staleTime** to reduce unnecessary refetches
5. **Use enabled option** to conditionally fetch data

See [lib/tanstack/README.md](../lib/tanstack/README.md) for complete documentation.

## Next.js 16 Breaking Changes

### Dynamic Route Params

**CRITICAL**: In Next.js 16, route params are now async. Always await:

```typescript
// ✅ CORRECT (Next.js 16)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // Must await
  // ... use id
}

// ❌ WRONG (Next.js 15 pattern)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id; // Won't work in Next.js 16
}
```

All dynamic route handlers must follow this pattern.

## Project-Specific Conventions (Frontend)

### Styling Patterns

- Tailwind v4 with CSS-first approach (`@import "tailwindcss"` in `app/globals.css`)
- Animation utilities via `tw-animate-css` package
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- All theme tokens defined in `@theme inline` block in globals.css

### Component Structure

- Place reusable components in `components/`
- Use shadcn/ui components via `@/components/ui` alias
- Server components by default (App Router convention)
- Use TanStack Query hooks for data fetching in client components

## Documentation Reference

- **[API.md](../API.md)** - Complete API reference with request/response examples
- **[SETUP.md](../SETUP.md)** - Database setup, deployment, troubleshooting
- **[API_README.md](../API_README.md)** - Implementation summary and architecture overview
- **[lib/tanstack/README.md](../lib/tanstack/README.md)** - TanStack Query architecture and usage examples
- **[supabase/schema.sql](../supabase/schema.sql)** - Database schema with inline comments
