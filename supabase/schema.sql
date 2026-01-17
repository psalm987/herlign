-- =====================================================
-- HERLIGN DATABASE SCHEMA
-- Next.js 16 App Router + Supabase
-- Created: 2026-01-17
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTENT TABLES
-- =====================================================

-- Events/Workshops Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('event', 'workshop')),
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('live', 'online')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  external_link VARCHAR(500),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  max_attendees INTEGER,
  image_url VARCHAR(500),
  price DECIMAL(10, 2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_attendees CHECK (max_attendees IS NULL OR max_attendees > 0),
  CONSTRAINT valid_price CHECK (price >= 0)
);

-- Resources Table (External Links Only)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  external_link VARCHAR(500) NOT NULL,
  format VARCHAR(50) NOT NULL CHECK (format IN ('ebook', 'guide', 'template')),
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  price DECIMAL(10, 2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_price CHECK (price >= 0)
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url VARCHAR(500),
  review TEXT NOT NULL,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_title VARCHAR(255),
  is_approved BOOLEAN DEFAULT FALSE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links Table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  href VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Library Table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL UNIQUE,
  alt_text VARCHAR(500),
  size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_size CHECK (size > 0 AND size <= 5242880) -- 5MB max
);

-- =====================================================
-- CHAT SYSTEM TABLES (GDPR-Compliant)
-- =====================================================

-- Chat Sessions (30-day retention)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_ip_hash VARCHAR(64) NOT NULL, -- SHA256 hash
  current_mode VARCHAR(20) DEFAULT 'auto' CHECK (current_mode IN ('auto', 'live')),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  auto_switch_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  CONSTRAINT valid_expires CHECK (expires_at > created_at)
);

-- Index for efficient IP hash lookups and cleanup
CREATE INDEX idx_chat_sessions_ip_hash ON chat_sessions(guest_ip_hash);
CREATE INDEX idx_chat_sessions_expires_at ON chat_sessions(expires_at);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('guest', 'admin', 'bot')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient message retrieval
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- EVENTS POLICIES
-- =====================================================

-- Public: Read published events
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  USING (status = 'published');

-- Admin: Full access to own events
CREATE POLICY "Admins can manage their own events"
  ON events FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

-- Admin: View all events (for admin panel)
CREATE POLICY "Admins can view all events"
  ON events FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- RESOURCES POLICIES
-- =====================================================

-- Public: Read all resources
CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  USING (true);

-- Admin: Full access to own resources
CREATE POLICY "Admins can manage their own resources"
  ON resources FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

-- =====================================================
-- TESTIMONIALS POLICIES
-- =====================================================

-- Public: Read approved testimonials only
CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- Admin: Full access to all testimonials
CREATE POLICY "Admins can manage all testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- LINKS POLICIES
-- =====================================================

-- Public: Read all links
CREATE POLICY "Anyone can view links"
  ON links FOR SELECT
  USING (true);

-- Admin: Full access to own links
CREATE POLICY "Admins can manage their own links"
  ON links FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

-- =====================================================
-- MEDIA POLICIES
-- =====================================================

-- Public: Read all media (for displaying images)
CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (true);

-- Admin: Full access to own media
CREATE POLICY "Admins can manage their own media"
  ON media FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

-- =====================================================
-- CHAT SESSION POLICIES
-- =====================================================

-- Guests: Read own session by IP hash (handled in application layer)
-- No RLS policy needed - access controlled via application logic

-- Admin: View all sessions
CREATE POLICY "Admins can view all chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin: Update sessions they're assigned to
CREATE POLICY "Admins can update their assigned sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = admin_id OR auth.role() = 'authenticated')
  WITH CHECK (auth.uid() = admin_id OR auth.role() = 'authenticated');

-- =====================================================
-- CHAT MESSAGES POLICIES
-- =====================================================

-- Guests: Handled in application layer (by session IP hash)
-- Admin: View messages in sessions
CREATE POLICY "Admins can view all chat messages"
  ON chat_messages FOR SELECT
  USING (
    auth.role() = 'authenticated' OR
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
    )
  );

-- Admin: Insert messages
CREATE POLICY "Admins can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_message_at in chat sessions
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NEW.created_at
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for chat messages
CREATE TRIGGER update_chat_session_timestamp
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_message();

-- Function to clean up expired chat sessions (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_chat_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE BUCKET CONFIGURATION
-- =====================================================

-- Create storage bucket for media files
-- Run this in Supabase Dashboard > Storage or via API:
-- 
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('media', 'media', true);
--
-- Storage RLS Policies (apply in Supabase Dashboard):
-- 1. Public: SELECT (allow anyone to view)
-- 2. Authenticated: INSERT (allow admins to upload)
-- 3. Authenticated: DELETE (allow admins to delete own files)

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Events
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_admin_id ON events(admin_id);

-- Resources
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_format ON resources(format);
CREATE INDEX idx_resources_admin_id ON resources(admin_id);

-- Testimonials
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);

-- Links
CREATE INDEX idx_links_category ON links(category);

-- Media
CREATE INDEX idx_media_is_used ON media(is_used);
CREATE INDEX idx_media_admin_id ON media(admin_id);

-- =====================================================
-- INITIAL DATA (Optional)
-- =====================================================

-- Example: Insert sample categories (if needed)
-- You can add seed data here or via your application

-- =====================================================
-- NOTES FOR DEPLOYMENT
-- =====================================================

-- 1. Run this schema in Supabase SQL Editor
-- 2. Configure Storage bucket 'media' with:
--    - Max file size: 5MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml
-- 3. Set up cron job to run cleanup_expired_chat_sessions() daily
--    (Use pg_cron extension or external service like GitHub Actions)
-- 4. Configure authentication providers in Supabase Dashboard
-- 5. Add admin users via Supabase Dashboard > Authentication > Users
-- 6. Update .env.local with Supabase credentials
