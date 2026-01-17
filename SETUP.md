# Herlign API - Setup Guide

Complete setup instructions for the Herlign Next.js 16 API with Supabase backend.

## Prerequisites

- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account for deployment (optional)
- AI provider API key (OpenAI, Gemini, or DeepSeek)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your credentials:
   - Project URL
   - Anon/Public key
   - Service role key (keep secret!)

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Provider (choose ONE)
OPENAI_API_KEY=sk-...

# Security
IP_HASH_SALT=generate-random-salt-here

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate a random salt:

```bash
openssl rand -base64 32
```

### 4. Set Up Database

1. Go to Supabase Dashboard > SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL script
4. Verify tables were created in Table Editor

### 5. Configure Storage

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `media`
3. Set it to Public
4. Add storage policies:

```sql
-- Allow public to view
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow users to delete own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[2]);
```

### 6. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" > "Create new user"
3. Enter email and password
4. Confirm the user (click the three dots > "Confirm")

### 7. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## API Testing

### Test Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'

# Check session
curl http://localhost:3000/api/auth/session
```

### Test Public Endpoints

```bash
# Get events
curl http://localhost:3000/api/events

# Get resources
curl http://localhost:3000/api/resources

# Get testimonials
curl http://localhost:3000/api/testimonials
```

### Test Chat

```bash
# Send a message
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, I need career advice"}'

# Get history
curl http://localhost:3000/api/chat/history
```

## Database Maintenance

### Clean Up Expired Chat Sessions

Set up a cron job or use GitHub Actions to run daily:

```sql
SELECT cleanup_expired_chat_sessions();
```

Or create an API route and call it via cron:

```typescript
// app/api/cron/cleanup/route.ts
import { cleanupExpiredSessions } from "@/lib/chat/session";

export async function GET() {
  const deleted = await cleanupExpiredSessions();
  return Response.json({ deleted });
}
```

Then use a service like [cron-job.org](https://cron-job.org) to hit the endpoint daily.

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Important:** Set these in Vercel:

- All environment variables from `.env.local`
- `NEXT_PUBLIC_SITE_URL` to your production URL

### Supabase Production Settings

1. Enable RLS on all tables (already done in schema)
2. Set up database backups (Dashboard > Database > Backups)
3. Configure email templates for auth (Dashboard > Authentication > Email Templates)
4. Enable email rate limiting
5. Set up monitoring and alerts

## Security Checklist

- [x] RLS policies enabled on all tables
- [x] Service role key stored securely (never in client code)
- [x] Rate limiting implemented
- [x] Input validation with Zod
- [x] IP hashing for GDPR compliance
- [x] File upload restrictions (5MB, allowed types)
- [ ] Configure allowed admin email domains (optional)
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Enable Supabase auth email confirmation
- [ ] Configure CORS for production

## Troubleshooting

### Authentication Issues

**Problem:** "Unauthorized" errors

**Solutions:**

1. Check cookie settings in browser
2. Verify Supabase credentials
3. Ensure admin user is confirmed
4. Check middleware configuration

### Upload Issues

**Problem:** File upload fails

**Solutions:**

1. Verify storage bucket exists and is public
2. Check storage policies
3. Ensure file size < 5MB
4. Verify allowed MIME types

### Chat Not Working

**Problem:** AI responses fail

**Solutions:**

1. Verify AI API key is set correctly
2. Check which provider is configured
3. Review error logs for API errors
4. Ensure IP hashing salt is set

### Database Connection Issues

**Problem:** Can't connect to Supabase

**Solutions:**

1. Verify project URL and keys
2. Check if Supabase project is paused (free tier)
3. Ensure RLS policies allow operations
4. Check service role key for admin operations

## Environment Variables Reference

| Variable                        | Required | Description                         |
| ------------------------------- | -------- | ----------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key              |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Supabase service role key (secret!) |
| `OPENAI_API_KEY`                | One of   | OpenAI API key                      |
| `GEMINI_API_KEY`                | three    | Google Gemini API key               |
| `DEEPSEEK_API_KEY`              | required | DeepSeek API key                    |
| `IP_HASH_SALT`                  | Yes      | Random salt for IP hashing          |
| `NEXT_PUBLIC_SITE_URL`          | Yes      | Your site URL                       |
| `STORAGE_QUOTA_LIMIT`           | No       | Max storage in bytes (default: 1GB) |
| `STORAGE_ALERT_THRESHOLD`       | No       | Alert threshold (default: 0.8)      |
| `ALLOWED_ADMIN_DOMAINS`         | No       | Comma-separated admin email domains |

## Project Structure

```
herlign-website/
├── app/
│   └── api/
│       ├── auth/           # Authentication endpoints
│       ├── admin/          # Admin CRUD endpoints
│       ├── chat/           # Public chat endpoints
│       ├── events/         # Public events endpoint
│       ├── resources/      # Public resources endpoint
│       ├── testimonials/   # Public testimonials endpoint
│       └── links/          # Public links endpoint
├── lib/
│   ├── supabase/          # Supabase clients & types
│   ├── validators/        # Zod schemas
│   ├── chat/              # Chat session & AI handling
│   ├── auth.ts            # Auth helpers
│   ├── storage.ts         # File upload utilities
│   ├── rate-limit.ts      # Rate limiting
│   └── utils.ts           # General utilities
├── supabase/
│   └── schema.sql         # Database schema
├── .env.example           # Example environment variables
├── API.md                 # API documentation
└── SETUP.md              # This file
```

## Next Steps

1. **Create Admin Dashboard** - Build a React admin UI
2. **Add Email Notifications** - Notify admins of new chat messages
3. **Implement Search** - Add full-text search for resources/events
4. **Analytics** - Track usage metrics
5. **Email Templates** - Customize auth emails in Supabase

## Support

For issues or questions:

1. Check this guide and API.md
2. Review Supabase documentation
3. Check Next.js 16 documentation
4. Open an issue in the repository

## License

Proprietary - Herlign Platform
