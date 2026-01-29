# Missing API Endpoints

This document lists all the API endpoints that need to be implemented for full admin functionality. The frontend is already built and ready to consume these APIs.

## 🔴 Critical Missing APIs

### 1. Password Reset Flow

**Required Endpoints:**

```typescript
POST /api/auth/forgot-password
Body: { email: string }
Response: { message: string }

POST /api/auth/reset-password
Body: { token: string, password: string }
Response: { message: string }
```

**Status:** Not implemented
**Priority:** High
**Frontend Ready:** ✅ Yes - [app/(auth)/forgot-password/page.tsx](<app/(auth)/forgot-password/page.tsx>)

---

### 2. Bulk Delete Operations

**Required Endpoints:**

```typescript
DELETE /api/admin/events/bulk
Body: { ids: string[] }
Response: { deleted: number, message: string }

DELETE /api/admin/resources/bulk
Body: { ids: string[] }
Response: { deleted: number, message: string }

DELETE /api/admin/testimonials/bulk
Body: { ids: string[] }
Response: { deleted: number, message: string }

DELETE /api/admin/links/bulk
Body: { ids: string[] }
Response: { deleted: number, message: string }

DELETE /api/admin/media/bulk
Body: { ids: string[] }
Response: { deleted: number, message: string }
```

**Status:** Not implemented
**Priority:** Medium
**Frontend Ready:** ✅ Yes - All list pages have bulk action buttons
**Implementation Note:** Can be added to existing route files with additional handler

---

### 3. Infinite Scroll for Media

**Required Enhancement:**

```typescript
GET /api/admin/media?page={page}&limit={limit}&cursor={cursor}
Response: {
  data: Media[],
  pagination: { page, limit, total, totalPages },
  nextCursor?: string  // NEW: for infinite scroll
}
```

**Status:** Partially implemented (pagination exists, but no cursor support)
**Priority:** Medium
**Frontend Ready:** ✅ Yes - [components/admin/media-picker-modal.tsx](components/admin/media-picker-modal.tsx) uses infinite scroll

---

### 4. Dashboard Statistics

**Required Endpoint:**

```typescript
GET /api/admin/stats
Response: {
  totalEvents: number,
  publishedEvents: number,
  draftEvents: number,
  totalResources: number,
  totalTestimonials: number,
  approvedTestimonials: number,
  pendingTestimonials: number,
  totalLinks: number,
  totalMedia: number,
  mediaStorageUsed: number,  // in bytes
  activeChatSessions: number,
  liveChatSessions: number,
  autoChatSessions: number,
}
```

**Status:** Not implemented
**Priority:** Low (hardcoded values work for now)
**Frontend Ready:** ⚠️ Dashboard shows hardcoded values - [app/admin/page.tsx](app/admin/page.tsx)

---

### 5. Export Functionality

**Required Endpoints:**

```typescript
GET /api/admin/events/export?format=csv|json
Response: File download

GET /api/admin/resources/export?format=csv|json
Response: File download

GET /api/admin/testimonials/export?format=csv|json
Response: File download
```

**Status:** Not implemented
**Priority:** Low
**Frontend Ready:** ❌ Not built yet (can be added as action buttons)

---

### 6. Batch Approve Testimonials

**Required Endpoint:**

```typescript
POST /api/admin/testimonials/approve-bulk
Body: { ids: string[] }
Response: { approved: number, message: string }
```

**Status:** Not implemented
**Priority:** Medium
**Frontend Ready:** ⚠️ Can use bulk actions (needs minor frontend addition)

---

### 7. Media Usage Detection

**Required Endpoint:**

```typescript
POST /api/admin/media/scan-usage
Body: { mediaId: string }
Response: {
  isUsed: boolean,
  usedIn: Array<{
    type: 'event' | 'resource' | 'testimonial',
    id: string,
    title: string
  }>
}
```

**Status:** Not implemented
**Priority:** Low
**Frontend Ready:** ❌ Not built yet
**Implementation Note:** Would require scanning all tables for media URL references

---

### 8. Real-time Chat Notifications

**Required Endpoint:**

```typescript
GET /api/admin/chat/notifications (Server-Sent Events or WebSocket)
Response: Stream of new message events
```

**Status:** Not implemented
**Priority:** Medium
**Frontend Ready:** ❌ Not built yet (would need WebSocket/SSE client)

---

### 9. Advanced Filtering

**Enhancement Needed:** Add more query parameters to existing endpoints

```typescript
GET /api/admin/events
  ?status=published,draft  // Multiple statuses
  &featured=true
  &dateFrom=2026-01-01
  &dateTo=2026-12-31
  &sort=start_date:desc
  &include=admin  // Include admin user details

GET /api/admin/testimonials
  ?approved=true,false
  &rating=5,4
  &sort=created_at:desc

GET /api/admin/resources
  ?category=career,leadership
  &format=ebook,guide
  &isPaid=true
  &sort=created_at:desc
```

**Status:** Partially implemented (basic filtering exists)
**Priority:** Low
**Frontend Ready:** ✅ DataTables support filtering

---

## 📋 Implementation Priority

### High Priority (Core Functionality)

1. ✅ **Password Reset** - Security essential
2. **Bulk Delete** - UX improvement for admins

### Medium Priority (Enhanced UX)

3. **Infinite Scroll Cursor** - Better performance for large media libraries
4. **Batch Approve Testimonials** - Admin efficiency
5. **Real-time Chat Notifications** - Live chat monitoring

### Low Priority (Nice to Have)

6. **Dashboard Statistics API** - Currently using hardcoded values
7. **Export Functionality** - Data portability
8. **Media Usage Detection** - Cleanup helper
9. **Advanced Filtering** - Already have basic filtering

---

## 🛠️ Implementation Guide

### For Backend Developers:

1. **Start with Bulk Delete APIs**
   - Simple to implement
   - High user value
   - Can use existing delete logic in a loop or batch query

2. **Add Dashboard Stats Endpoint**
   - Single endpoint
   - Aggregate queries from existing tables
   - Cache results for 5 minutes

3. **Implement Password Reset**
   - Use Supabase Auth password reset flow
   - Add email templates in Supabase Dashboard
   - Frontend already built

4. **Enhance Media Pagination**
   - Add cursor-based pagination
   - Return `nextCursor` in response
   - Frontend MediaPickerModal ready to consume

5. **Add Batch Operations**
   - Testimonial bulk approve
   - Can reuse existing approve logic

### Example: Bulk Delete Implementation

```typescript
// app/api/admin/events/bulk/route.ts
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { ids } = await request.json();

    const { error, count } = await supabase
      .from("events")
      .delete()
      .in("id", ids)
      .eq("admin_id", user.id); // Security: only delete own events

    if (error) throw error;

    return NextResponse.json({
      deleted: count,
      message: `${count} event(s) deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
```

---

## ✅ Already Implemented

The following are already working:

- ✅ Authentication (login, logout, session)
- ✅ Events CRUD
- ✅ Resources CRUD
- ✅ Testimonials CRUD with approve
- ✅ Links CRUD
- ✅ Media upload, list, delete
- ✅ Unused media detection
- ✅ Chat sessions list
- ✅ Chat session view
- ✅ Send admin message
- ✅ Switch chat mode
- ✅ Basic pagination
- ✅ Basic filtering
- ✅ Single item delete

---

## 📱 Frontend Status

All admin pages are fully built and functional:

- ✅ Login page with validation
- ✅ Dashboard with stats cards
- ✅ Events: List, Create, Edit (with media picker)
- ✅ Resources: List, Create, Edit
- ✅ Testimonials: List, Create, Edit, Approve
- ✅ Links: List, Create, Edit
- ✅ Media: Library with upload, delete, search, unused filter
- ✅ Chat: Sessions list, individual session view with messaging
- ✅ Responsive sidebar navigation
- ✅ Unsaved changes warnings
- ✅ Confirmation dialogs
- ✅ Toast notifications
- ✅ TanStack Table with sorting, filtering, pagination
- ✅ Media picker modal with infinite scroll

---

## 🎯 Summary

**Total Missing APIs:** 9 major features

**Breakdown:**

- 🔴 High Priority: 2
- 🟡 Medium Priority: 3
- 🟢 Low Priority: 4

**Estimated Implementation Time:**

- High: 4-6 hours
- Medium: 6-8 hours
- Low: 4-6 hours
- **Total: 14-20 hours**

---

**Last Updated:** January 21, 2026
**Frontend Version:** Complete
**Backend Version:** Core APIs implemented, enhancements pending
