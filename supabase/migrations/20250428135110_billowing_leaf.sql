/*
  # Add Country Column to Personal Info Table

  1. Changes
    - Add country column to personal_info table
    - Drop country_code column if it exists
    - Update RLS policies
*/

-- First check if country_code column exists and drop it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_info' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE personal_info DROP COLUMN country_code;
  END IF;
END $$;

-- Add country column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_info' AND column_name = 'country'
  ) THEN
    ALTER TABLE personal_info ADD COLUMN country TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- Remove the default after adding the column
ALTER TABLE personal_info ALTER COLUMN country DROP DEFAULT;