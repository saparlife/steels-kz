-- Add options column to attribute_definitions for select-type attributes
ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS options jsonb DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN attribute_definitions.options IS 'Array of available options for select-type attributes';
