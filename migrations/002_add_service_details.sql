ALTER TABLE services
ADD COLUMN description TEXT,
ADD COLUMN included_items TEXT[];

-- Update existing rows with default values
UPDATE services
SET description = 'Service description goes here',
    included_items = ARRAY[]::TEXT[]
WHERE description IS NULL;