-- Parse progress tracking
CREATE TABLE IF NOT EXISTS parse_progress (
  category_id UUID PRIMARY KEY REFERENCES categories(id) ON DELETE CASCADE,
  source_url TEXT,
  attributes_parsed BOOLEAN DEFAULT FALSE,
  products_parsed BOOLEAN DEFAULT FALSE,
  products_count INTEGER DEFAULT 0,
  last_page INTEGER DEFAULT 0,
  error_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Image mapping for deduplication
CREATE TABLE IF NOT EXISTS image_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT UNIQUE NOT NULL,
  storage_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add source_url to product_images for tracking original URL
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_image_mapping_source_url ON image_mapping(source_url);
CREATE INDEX IF NOT EXISTS idx_product_images_source_url ON product_images(source_url);
CREATE INDEX IF NOT EXISTS idx_parse_progress_status ON parse_progress(attributes_parsed, products_parsed);

-- Add unique constraint on products slug
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_slug_unique;
ALTER TABLE products ADD CONSTRAINT products_slug_unique UNIQUE (slug);

-- Add unique constraint on attribute_definitions slug
ALTER TABLE attribute_definitions DROP CONSTRAINT IF EXISTS attribute_definitions_slug_unique;
ALTER TABLE attribute_definitions ADD CONSTRAINT attribute_definitions_slug_unique UNIQUE (slug);
