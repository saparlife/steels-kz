-- Add source_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_url TEXT;
