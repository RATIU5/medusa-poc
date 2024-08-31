-- Drop the index on type and slug
DROP INDEX IF EXISTS idx_items_type;
DROP INDEX IF EXISTS idx_items_slug;

-- Alter the items table
ALTER TABLE items
    DROP COLUMN type,
    DROP COLUMN slug;

-- Drop the item_type enum
DROP TYPE IF EXISTS item_type;