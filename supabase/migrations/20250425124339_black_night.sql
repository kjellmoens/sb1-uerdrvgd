/*
  # Fix Awards RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-enable RLS
    - Create new policies with proper user authentication checks
    - Add updated_at trigger

  2. Security
    - Ensure users can only access their own awards
    - Verify user ownership through cv_id relationship
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own awards" ON awards;
DROP POLICY IF EXISTS "Users can insert own awards" ON awards;
DROP POLICY IF EXISTS "Users can update own awards" ON awards;
DROP POLICY IF EXISTS "Users can delete own awards" ON awards;

-- Enable RLS
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can read own awards"
ON awards
FOR SELECT
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

-- Ensure updated_at trigger exists
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