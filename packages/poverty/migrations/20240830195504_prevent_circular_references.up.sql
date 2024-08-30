CREATE OR REPLACE FUNCTION prevent_circular_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        WITH RECURSIVE tree AS (
            SELECT id, parent_id FROM items WHERE id = NEW.parent_id
            UNION ALL
            SELECT i.id, i.parent_id FROM items i
            INNER JOIN tree t ON t.parent_id = i.id
        )
        SELECT 1 FROM tree WHERE id = NEW.id
    ) THEN
        RAISE EXCEPTION 'Circular reference detected';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_ref_trigger
    BEFORE INSERT OR UPDATE ON items
    FOR EACH ROW
    WHEN (NEW.parent_id IS NOT NULL)
    EXECUTE FUNCTION prevent_circular_reference();