/*
  # Update Companies Schema

  1. Changes
    - Add city column
    - Make city column required
*/

-- Add city column if it doesn't exist
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';

-- Make city column required after adding default value
ALTER TABLE companies
ALTER COLUMN city SET NOT NULL;

-- Remove the default value
ALTER TABLE companies
ALTER COLUMN city DROP DEFAULT;