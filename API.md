# Herlign API Documentation

Complete API reference for the Herlign women's career community platform.

## Base URL

```
Development: http://localhost:3000/api
Production: https://herlign.com/api
```

## Authentication

All `/api/admin/*` endpoints require authentication via Supabase Auth.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}

Response 200:
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

### Logout

```http
POST /api/auth/logout

Response 200:
{
  "message": "Logout successful"
}
```

### Check Session

```http
GET /api/auth/session

Response 200:
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

## Public Endpoints

### Events

**List Published Events**

```http
GET /api/events?type=workshop&mode=online&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "type": "workshop",
      "mode": "online",
      "title": "Career Pivot Workshop",
      "description": "Learn how to successfully pivot your career...",
      "external_link": "https://zoom.us/j/123",
      "start_date": "2026-02-01T10:00:00Z",
      "end_date": "2026-02-01T12:00:00Z",
      "max_attendees": 50,
      "image_url": "https://...",
      "price": 29.99,
      "is_paid": true,
      "status": "published",
      "created_at": "2026-01-17T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Resources

**List Resources**

```http
GET /api/resources?format=ebook&category=career&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "title": "The Career Pivot Guide",
      "description": "A comprehensive guide to changing careers...",
      "external_link": "https://example.com/download",
      "format": "ebook",
      "category": "career",
      "tags": ["career-change", "strategy"],
      "price": 0,
      "is_paid": false,
      "created_at": "2026-01-17T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Testimonials

**List Approved Testimonials**

```http
GET /api/testimonials?rating=5&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "avatar_url": "https://...",
      "review": "Herlign transformed my career!",
      "reviewer_name": "Sarah Johnson",
      "reviewer_title": "Software Engineer",
      "is_approved": true,
      "created_at": "2026-01-17T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Links

**List Links**

```http
GET /api/links?category=learning&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "name": "LinkedIn Learning",
      "href": "https://linkedin.com/learning",
      "category": "learning",
      "created_at": "2026-01-17T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

## Chat Endpoints

### Send Message (Guest)

```http
POST /api/chat/message
Content-Type: application/json

{
  "message": "How can I prepare for a career change?"
}

Response 200:
{
  "sessionId": "uuid",
  "response": "Great question! Here are some steps...",
  "mode": "auto"
}
```

### Get Chat History (Guest)

```http
GET /api/chat/history

Response 200:
{
  "sessionId": "uuid",
  "mode": "auto",
  "messages": [
    {
      "id": "uuid",
      "sender": "guest",
      "content": "How can I prepare for a career change?",
      "timestamp": "2026-01-17T10:00:00Z"
    },
    {
      "id": "uuid",
      "sender": "bot",
      "content": "Great question! Here are some steps...",
      "timestamp": "2026-01-17T10:00:05Z"
    }
  ]
}
```

## Admin Endpoints

All admin endpoints require authentication.

### Events Management

**List Events (Admin)**

```http
GET /api/admin/events?status=draft&page=1&limit=20
Authorization: Required (via cookie)

Response 200: Same structure as public endpoint but includes all statuses
```

**Create Event**

```http
POST /api/admin/events
Content-Type: application/json

{
  "type": "workshop",
  "mode": "online",
  "title": "Leadership Skills for Women",
  "description": "Develop essential leadership skills...",
  "external_link": "https://zoom.us/j/456",
  "start_date": "2026-03-01T14:00:00Z",
  "end_date": "2026-03-01T16:00:00Z",
  "max_attendees": 30,
  "image_url": "https://...",
  "price": 0,
  "is_paid": false,
  "status": "published"
}

Response 201:
{
  "data": {...},
  "message": "Event created successfully"
}
```

**Update Event**

```http
PUT /api/admin/events/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}

Response 200:
{
  "data": {...},
  "message": "Event updated successfully"
}
```

**Delete Event**

```http
DELETE /api/admin/events/:id

Response 200:
{
  "message": "Event deleted successfully"
}
```

### Resources, Links, Testimonials

Same CRUD pattern as Events. Endpoints:

- `/api/admin/resources`, `/api/admin/resources/:id`
- `/api/admin/links`, `/api/admin/links/:id`
- `/api/admin/testimonials`, `/api/admin/testimonials/:id`

**Approve Testimonial**

```http
POST /api/admin/testimonials/:id/approve

Response 200:
{
  "data": {...},
  "message": "Testimonial approved successfully"
}
```

### Media Management

**List Media**

```http
GET /api/admin/media?is_used=false&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "filename": "workshop-banner.jpg",
      "url": "https://supabase.co/storage/...",
      "alt_text": "Workshop banner image",
      "size": 245760,
      "mime_type": "image/jpeg",
      "is_used": true,
      "created_at": "2026-01-17T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

**Upload Media**

```http
POST /api/admin/media/upload
Content-Type: multipart/form-data

{
  "file": <File>,
  "alt_text": "Description of image"
}

Response 201:
{
  "data": {...},
  "message": "File uploaded successfully",
  "quota": {
    "used": 5242880,
    "percentUsed": 0.5
  }
}
```

**Delete Media**

```http
DELETE /api/admin/media/:id

Response 200:
{
  "message": "Media deleted successfully"
}
```

**List Unused Media**

```http
GET /api/admin/media/unused

Response 200:
{
  "data": [...]
}
```

### Chat Management

**List Chat Sessions**

```http
GET /api/admin/chat/sessions?mode=live&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "guest_ip_hash": "abc123...",
      "current_mode": "live",
      "admin_id": "uuid",
      "last_message_at": "2026-01-17T10:30:00Z",
      "created_at": "2026-01-17T10:00:00Z",
      "expires_at": "2026-02-16T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

**Get Session Details**

```http
GET /api/admin/chat/sessions/:id

Response 200:
{
  "session": {...},
  "messages": [
    {
      "id": "uuid",
      "sender": "guest",
      "content": "I need career advice",
      "timestamp": "2026-01-17T10:00:00Z"
    }
  ]
}
```

**Send Admin Response**

```http
POST /api/admin/chat/sessions/:id
Content-Type: application/json

{
  "message": "Hello! I'm here to help. What specific career questions do you have?"
}

Response 200:
{
  "message": "Message sent successfully"
}
```

**Switch Chat Mode**

```http
POST /api/admin/chat/sessions/:id/mode
Content-Type: application/json

{
  "mode": "live"
}

Response 200:
{
  "data": {...},
  "message": "Chat mode switched to live"
}
```

## Error Responses

All endpoints follow consistent error formatting:

```json
{
  "error": "Error message",
  "details": [...]  // Optional validation errors
}
```

**Common Status Codes:**

- `400` - Bad Request (validation failed)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limits

- **Chat**: 10 messages per minute
- **Upload**: 5 uploads per minute
- **Auth**: 5 attempts per 5 minutes
- **General API**: 100 requests per minute

Rate limit headers:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1610000000
Retry-After: 60
```

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response Format:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

## Caching

Public endpoints use HTTP caching:

```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

- Public data cached for 5 minutes
- Stale data served while revalidating for up to 10 minutes

## CORS

CORS is enabled for all origins in development. Configure for production in `next.config.ts`.
