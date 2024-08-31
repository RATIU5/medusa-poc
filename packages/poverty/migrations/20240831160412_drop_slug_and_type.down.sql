-- Recreate the item_type enum
CREATE TYPE item_type AS ENUM ('page', 'post', 'media', 'collection');

-- Add back the type and slug columns
ALTER TABLE items
    ADD COLUMN type item_type,
    ADD COLUMN slug TEXT;

-- Recreate the indexes
CREATE INDEX idx_items_type ON items USING BTREE (type);
CREATE INDEX idx_items_slug ON items USING BTREE (slug);

-- Update existing rows (this is a placeholder, you'll need to decide how to populate these fields)
UPDATE items SET type = 'page', slug = id::text;

-- Add NOT NULL and UNIQUE constraints back
ALTER TABLE items
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN slug SET NOT NULL,
    ADD CONSTRAINT items_slug_key UNIQUE (slug);