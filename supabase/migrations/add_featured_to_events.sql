-- Migration: Add featured column to events table
-- Date: 2026-01-17
-- Description: Adds a boolean field to mark events as featured for carousel display

-- Add featured column with default false
ALTER TABLE events
ADD COLUMN featured BOOLEAN DEFAULT FALSE NOT NULL;

-- Add index for efficient featured event queries
CREATE INDEX idx_events_featured ON events(featured) WHERE featured = true;

-- Add comment
COMMENT ON COLUMN events.featured IS 'Marks event as featured for carousel display. Recommend max 5 featured events.';
