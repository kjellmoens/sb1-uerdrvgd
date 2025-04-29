/*
  # Add Country Field to Education Table

  1. Changes
    - Add country column to education table
    - Make it required
*/

ALTER TABLE education
ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT '';

-- Remove the default after adding the column
ALTER TABLE education
ALTER COLUMN country DROP DEFAULT;