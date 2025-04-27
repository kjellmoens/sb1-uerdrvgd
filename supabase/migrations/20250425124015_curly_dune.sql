/*
  # Fix Awards RLS Policies

  1. Changes
    - Add proper RLS policies for awards table
    - Ensure users can only access their own awards through CV ownership
    - Add updated_at trigger for awards table

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own awards
*/

-- First, ensure RLS is enabled
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own awards" ON awards;
DROP POLICY IF EXISTS "Users can insert own awards" ON awards;
DROP POLICY IF EXISTS "Users can update own awards" ON awards;
DROP POLICY IF EXISTS "Users can delete own awards" ON awards;

-- Create new policies
CREATE POLICY "Users can read own awards"
  ON awards
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can insert own awards"
  ON awards
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can update own awards"
  ON awards
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can delete own awards"
  ON awards
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

-- Add updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_awards_updated_at'
  ) THEN
    CREATE TRIGGER update_awards_updated_at
      BEFORE UPDATE ON awards
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;