CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE item_type AS ENUM ('page', 'post', 'media', 'collection');

CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type item_type NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES items(id),
    content JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_parent CHECK (parent_id != id)
);

CREATE INDEX idx_items_type ON items USING BTREE (type);
CREATE INDEX idx_items_parent_id ON items USING BTREE (parent_id);
CREATE INDEX idx_items_slug ON items USING BTREE (slug);