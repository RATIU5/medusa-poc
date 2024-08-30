CREATE TABLE item_relationships (
    parent_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_id, child_id)
);

CREATE INDEX idx_item_relationships_parent_child ON item_relationships USING BTREE (parent_id, child_id);