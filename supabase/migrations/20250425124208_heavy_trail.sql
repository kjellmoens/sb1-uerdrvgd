/*
  # Update RLS policies for awards table

  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate policies with proper permissions
    
  2. Security
    - Maintains same security model
    - Users can only access awards for their own CVs
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own awards" ON awards;
DROP POLICY IF EXISTS "Users can insert own awards" ON awards;
DROP POLICY IF EXISTS "Users can update own awards" ON awards;
DROP POLICY IF EXISTS "Users can delete own awards" ON awards;

-- Enable RLS
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Policy for reading awards
CREATE POLICY "Users can read own awards"
ON awards
FOR SELECT
TO public
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

-- Policy for inserting awards
CREATE POLICY "Users can insert own awards"
ON awards
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

-- Policy for updating awards
CREATE POLICY "Users can update own awards"
ON awards
FOR UPDATE
TO public
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

-- Policy for deleting awards
CREATE POLICY "Users can delete own awards"
ON awards
FOR DELETE
TO public
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);