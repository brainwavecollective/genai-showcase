
-- Create a simple key-value table for storing counters and other runtime data
CREATE TABLE IF NOT EXISTS storage (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Add comment to table
COMMENT ON TABLE storage IS 'Table for storing key-value data like chat counter';
