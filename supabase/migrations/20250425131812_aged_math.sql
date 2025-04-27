/*
  # Fix Personal Info Schema

  1. Changes
    - Add missing updated_at columns
    - Add triggers for automatic timestamp updates
    - Ensure proper column types and constraints

  2. Security
    - No changes to RLS policies
*/

-- Add updated_at column to personal_info if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'personal_info' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE personal_info 
    ADD COLUMN updated_at timestamptz DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Add updated_at column to profile_summaries if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profile_summaries' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profile_summaries 
    ADD COLUMN updated_at timestamptz DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Create trigger for personal_info if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_personal_info_updated_at'
  ) THEN
    CREATE TRIGGER update_personal_info_updated_at
      BEFORE UPDATE ON personal_info
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create trigger for profile_summaries if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profile_summaries_updated_at'
  ) THEN
    CREATE TRIGGER update_profile_summaries_updated_at
      BEFORE UPDATE ON profile_summaries
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;