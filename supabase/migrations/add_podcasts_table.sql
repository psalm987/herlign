-- =====================================================
-- PODCASTS TABLE MIGRATION
-- Created: 2026-01-29
-- Description: Add podcasts table for YouTube integration
-- =====================================================

-- Podcasts Table
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_video_id VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  published_at TIMESTAMPTZ NOT NULL,
  duration VARCHAR(20),
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  channel_title VARCHAR(255),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category_id VARCHAR(50),
  is_visible BOOLEAN DEFAULT TRUE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_youtube_id CHECK (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$')
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_podcasts_youtube_video_id ON podcasts(youtube_video_id);
CREATE INDEX idx_podcasts_is_visible ON podcasts(is_visible);
CREATE INDEX idx_podcasts_published_at ON podcasts(published_at DESC);
CREATE INDEX idx_podcasts_view_count ON podcasts(view_count DESC);
CREATE INDEX idx_podcasts_created_at ON podcasts(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

-- Public: Read visible podcasts only
CREATE POLICY "Anyone can view visible podcasts"
  ON podcasts FOR SELECT
  USING (is_visible = true);

-- Admin: View all podcasts
CREATE POLICY "Admins can view all podcasts"
  ON podcasts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin: Create podcasts
CREATE POLICY "Admins can create podcasts"
  ON podcasts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admin: Update podcasts
CREATE POLICY "Admins can update podcasts"
  ON podcasts FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admin: Delete podcasts
CREATE POLICY "Admins can delete podcasts"
  ON podcasts FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE podcasts IS 'YouTube podcast videos synced from channel';
COMMENT ON COLUMN podcasts.youtube_video_id IS 'Unique YouTube video ID (11 characters)';
COMMENT ON COLUMN podcasts.is_visible IS 'Whether podcast is visible on public page';
COMMENT ON COLUMN podcasts.duration IS 'Video duration in ISO 8601 format (e.g., PT15M30S)';
COMMENT ON COLUMN podcasts.admin_id IS 'Admin who last modified the podcast';
