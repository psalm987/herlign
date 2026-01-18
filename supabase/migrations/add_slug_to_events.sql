-- Migration: Add slug column to events table
-- Created: 2026-01-18
-- Description: Adds a unique slug column for SEO-friendly URLs

-- Add slug column (nullable initially to handle existing rows)
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(20);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Add comment
COMMENT ON COLUMN events.slug IS 'URL-friendly slug (max 20 chars, unique)';

-- Note: Run this query to generate slugs for existing events:
-- UPDATE events SET slug = CONCAT(
--   LOWER(REGEXP_REPLACE(
--     REGEXP_REPLACE(
--       REGEXP_REPLACE(title, '[():!#,.\?&@\$%\^*+=\[\]{};''"|<>\/\\]+', ' ', 'g'),
--       '\s+', '-', 'g'
--     ),
--     '^-+|-+$', '', 'g'
--   )),
--   '-',
--   LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0')
-- )
-- WHERE slug IS NULL;

-- After generating slugs for existing events, make column NOT NULL:
-- ALTER TABLE events ALTER COLUMN slug SET NOT NULL;
