DROP TRIGGER IF EXISTS prevent_circular_ref_trigger ON items;
DROP FUNCTION IF EXISTS prevent_circular_reference();