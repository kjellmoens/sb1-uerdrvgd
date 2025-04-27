/*
  # Update RLS policies for awards table

  1. Changes
    - Drop existing policies
    - Recreate policies with correct permissions
    - Ensure RLS is enabled
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own awards" ON awards;
DROP POLICY IF EXISTS "Users can insert own awards" ON awards;
DROP POLICY IF EXISTS "Users can update own awards" ON awards;
DROP POLICY IF EXISTS "Users can delete own awards" ON awards;

-- Enable RLS
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Create policies
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
)
WITH CHECK (
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