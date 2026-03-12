-- Add SEO text fields to categories for rich HTML content
-- Separate from description_ru/kz which is used as short plain-text description
ALTER TABLE categories ADD COLUMN IF NOT EXISTS seo_text_ru TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS seo_text_kz TEXT;
