/*
  # Add Location to Companies Table

  1. Changes
    - Add location column to companies table
    - Update CVContext to use the new location field
*/

-- Add location column to companies table
ALTER TABLE companies
ADD COLUMN location TEXT;

-- Update CVContext query to use the new location field
DO $$ 
BEGIN
  -- No data migration needed since this is a new column
  NULL;
END $$;