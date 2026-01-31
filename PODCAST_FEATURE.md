# Podcast Feature Documentation

Complete implementation of YouTube-integrated podcast system for Herlign platform.

## ✅ Features Implemented

### Database

- ✅ Podcasts table with full YouTube metadata
- ✅ Migration SQL file (`supabase/migrations/add_podcasts_table.sql`)
- ✅ RLS policies (public read visible, admin full access)
- ✅ TypeScript types updated in `database.types.ts`

### API Endpoints

#### Public

- `GET /api/podcasts` - List visible podcasts with search/filter/pagination

#### Admin

- `GET /api/admin/podcasts` - List all podcasts
- `POST /api/admin/podcasts` - Create podcast (manual)
- `GET /api/admin/podcasts/:id` - Get single podcast
- `PUT /api/admin/podcasts/:id` - Update podcast (visibility toggle)
- `DELETE /api/admin/podcasts/:id` - Delete podcast
- `POST /api/admin/podcasts/sync` - Manual YouTube sync

#### Cron

- `POST /api/cron/podcasts/sync` - Automated weekly YouTube sync

### Frontend

#### Public Page (`/podcasts`)

- ✅ Search podcasts by title/description
- ✅ Filter by tags
- ✅ Sort by: Published Date, View Count, Like Count
- ✅ Pagination (12 per page)
- ✅ YouTube video embeds using `@next/third-parties/google`
- ✅ Responsive grid layout
- ✅ Empty states and loading skeletons

#### Admin Pages

- ✅ `/admin/podcasts` - List with stats and sync button
- ✅ `/admin/podcasts/create` - Manual creation (discouraged)
- ✅ `/admin/podcasts/:id/edit` - Edit visibility
- ✅ Data table with sorting, search, bulk actions
- ✅ Delete confirmation dialog
- ✅ Real-time sync progress with toast notifications

### Navigation

- ✅ Added "Podcasts" link to main navigation
- ✅ Added to footer menu
- ✅ Added to admin sidebar with Video icon
- ✅ Custom header color for podcasts page (peenk theme)

## 🚀 Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```bash
# YouTube Data API v3
# Get your API key from: https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-youtube-channel-id

# Cron Job Security (for automated sync)
# Generate: openssl rand -base64 32
IP_HASH_SALT=your-cron-secret
```

### 2. Get YouTube API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Copy the API key to `.env.local`

### 3. Find Your YouTube Channel ID

**Method 1: From Channel URL**

- Go to your YouTube channel
- URL format: `youtube.com/channel/YOUR_CHANNEL_ID`
- Copy the ID after `/channel/`

**Method 2: From About Page**

- Go to your channel > About tab
- Click "Share" > "Copy channel ID"

**Method 3: Using API**

```bash
https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=YOUR_USERNAME&key=YOUR_API_KEY
```

### 4. Run Database Migration

In Supabase SQL Editor, run:

```sql
-- Copy contents of supabase/migrations/add_podcasts_table.sql
```

Or use Supabase CLI:

```bash
supabase migration new add_podcasts_table
# Copy migration file content
supabase db push
```

### 5. Initial Sync

**Option A: Manual Sync (Recommended)**

1. Log into admin panel (`/admin`)
2. Navigate to Podcasts
3. Click "Sync from YouTube" button
4. Wait for sync to complete (toast notification)

**Option B: API Request**

```bash
curl -X POST http://localhost:3000/api/admin/podcasts/sync \
  -H "Cookie: your-auth-cookie"
```

## 📅 Automated Weekly Sync

### Setup with Vercel Cron Jobs

1. Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/podcasts/sync",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

2. Add cron secret to Vercel environment variables:
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add `IP_HASH_SALT` with your generated secret

3. Deploy to Vercel - cron will run automatically every Sunday at midnight UTC

### Setup with External Cron Service

Use services like [cron-job.org](https://cron-job.org) or [EasyCron](https://easycron.com):

1. Create new cron job
2. URL: `https://your-domain.com/api/cron/podcasts/sync`
3. Schedule: `0 0 * * 0` (every Sunday at midnight)
4. Add header: `Authorization: Bearer YOUR_IP_HASH_SALT`
5. Save and activate

## 🎨 Podcast Data Structure

### Database Schema

```typescript
interface Podcast {
  id: string;
  youtube_video_id: string; // 11-character YouTube ID
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string; // ISO 8601 datetime
  duration: string | null; // ISO 8601 duration (PT15M30S)
  view_count: number;
  like_count: number;
  comment_count: number;
  channel_title: string | null;
  tags: string[];
  category_id: string | null;
  is_visible: boolean; // Controlled by admin
  admin_id: string | null;
  created_at: string;
  updated_at: string;
}
```

### Sync Behavior

**What Gets Synced:**

- All videos from configured YouTube channel
- Video metadata (title, description, thumbnail)
- Statistics (views, likes, comments)
- Tags and category
- Duration

**What Doesn't Change:**

- `is_visible` - Preserved during sync
- Videos are added if new
- Videos are updated if already exist
- Videos are removed if deleted from YouTube

## 🔧 Usage Examples

### Public Page Features

**Search:**

```typescript
// Search by title or description
/podcasts?search=career
```

**Filter by Tags:**

```typescript
// Filter podcasts with specific tags
/podcasts?tags=motivation,success
```

**Sort:**

```typescript
// Sort by view count (descending)
/podcasts?sortBy=view_count&sortOrder=desc

// Sort by published date (newest first)
/podcasts?sortBy=published_at&sortOrder=desc
```

**Pagination:**

```typescript
// Get page 2 with 20 items per page
/podcasts?page=2&limit=20
```

### Admin Features

**Toggle Visibility:**

- Prevents podcast from showing on public page
- Useful for unlisted/private content
- Preserved during YouTube sync

**Manual Sync:**

- Fetches ALL videos from channel
- Updates existing video stats
- Removes deleted videos
- Adds new videos

**Edit Form:**

- Only allows changing `is_visible` toggle
- All other fields read-only (synced from YouTube)
- Shows link to YouTube video

## 📊 Admin Dashboard Stats

The admin podcasts page displays:

1. **Total Podcasts** - All podcasts in database
2. **Visible** - Podcasts shown on public page
3. **Hidden** - Podcasts hidden from public
4. **Total Views** - Sum of all view counts

## 🎯 Best Practices

### Recommended Workflow

1. **Initial Setup:**
   - Configure YouTube API credentials
   - Run initial sync to fetch all videos
   - Review and toggle visibility as needed

2. **Ongoing Management:**
   - Let weekly cron sync handle updates automatically
   - Use manual sync only when needed (new video uploaded)
   - Use visibility toggle to control what's public

3. **Performance:**
   - Public page caches results for 5 minutes
   - Sync only runs on demand or weekly schedule
   - Database indexes on `youtube_video_id`, `is_visible`, `published_at`

### Common Tasks

**Hide a Specific Podcast:**

1. Go to `/admin/podcasts`
2. Click edit icon for podcast
3. Uncheck "Visible on public page"
4. Save

**Update Video Stats:**

1. Go to `/admin/podcasts`
2. Click "Sync from YouTube"
3. Wait for completion toast

**Add New Video Immediately:**

- Upload to YouTube
- Click "Sync from YouTube" in admin
- Video appears automatically if public

## 🐛 Troubleshooting

### Sync Fails

**Error: "YouTube API key not configured"**

- Check `YOUTUBE_API_KEY` in environment variables
- Verify API key is valid
- Ensure YouTube Data API v3 is enabled in Google Cloud

**Error: "Could not find uploads playlist"**

- Verify `YOUTUBE_CHANNEL_ID` is correct
- Ensure channel has public videos
- Check channel isn't restricted

### Videos Not Appearing

**Video synced but not visible on public page:**

- Check `is_visible` field in admin
- Verify video status is not "private" on YouTube

**Video deleted from YouTube but still in database:**

- Run manual sync from admin
- Sync will remove videos no longer on YouTube

### Cron Not Running

**Vercel Cron:**

- Check Vercel deployment logs
- Verify `vercel.json` cron configuration
- Ensure `IP_HASH_SALT` is set in Vercel env vars

**External Cron:**

- Check cron service logs
- Verify authorization header is correct
- Test endpoint manually with curl

## 📚 API Reference

### Query Parameters (Public)

| Parameter   | Type     | Description                                            | Example                          |
| ----------- | -------- | ------------------------------------------------------ | -------------------------------- |
| `page`      | number   | Page number (default: 1)                               | `?page=2`                        |
| `limit`     | number   | Items per page (default: 20, max: 100)                 | `?limit=12`                      |
| `search`    | string   | Search in title/description                            | `?search=motivation`             |
| `tags`      | string   | Comma-separated tags                                   | `?tags=career,growth`            |
| `dateFrom`  | ISO date | Filter from date                                       | `?dateFrom=2026-01-01T00:00:00Z` |
| `dateTo`    | ISO date | Filter to date                                         | `?dateTo=2026-12-31T23:59:59Z`   |
| `sortBy`    | enum     | Sort field: `published_at`, `view_count`, `like_count` | `?sortBy=view_count`             |
| `sortOrder` | enum     | Sort order: `asc`, `desc`                              | `?sortOrder=desc`                |

### Response Format

```json
{
  "message": "Successfully retrieved 12 podcast(s)",
  "data": [
    {
      "id": "uuid",
      "youtube_video_id": "Ts6Z0lVStzg",
      "title": "How to Build Your Dream Career",
      "description": "...",
      "thumbnail_url": "https://...",
      "published_at": "2026-01-15T10:00:00Z",
      "duration": "PT15M30S",
      "view_count": 15234,
      "like_count": 823,
      "comment_count": 156,
      "tags": ["career", "motivation"],
      "is_visible": true,
      "created_at": "2026-01-29T00:00:00Z",
      "updated_at": "2026-01-29T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4,
    "hasNext": true
  }
}
```

## 🔐 Security

- ✅ RLS policies prevent unauthorized access
- ✅ Cron endpoint requires `IP_HASH_SALT` header
- ✅ Admin routes protected by authentication middleware
- ✅ Input validation with Zod schemas
- ✅ YouTube API key stored server-side only

## 📈 Performance

- **Public endpoint**: 5-minute cache (300s)
- **Database indexes**: Optimized for common queries
- **Pagination**: Prevents loading all videos at once
- **Async sync**: Doesn't block user interactions

---

**Implementation Date:** January 29, 2026  
**Version:** 1.0.0  
**Dependencies:** `@next/third-parties/google`, YouTube Data API v3
