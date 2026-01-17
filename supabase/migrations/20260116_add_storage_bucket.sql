-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images bucket
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow uploads to images bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow delete from images bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
