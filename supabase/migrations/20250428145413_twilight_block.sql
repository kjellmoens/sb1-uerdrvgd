/*
  # Fix Position Responsibilities Policies

  1. Changes
    - Drop existing policies
    - Recreate policies with proper ownership checks
    - Ensure RLS is enabled
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own position responsibilities" ON position_responsibilities;
DROP POLICY IF EXISTS "Users can read own position responsibilities" ON position_responsibilities;
DROP POLICY IF EXISTS "Users can update own position responsibilities" ON position_responsibilities;
DROP POLICY IF EXISTS "Users can delete own position responsibilities" ON position_responsibilities;

-- Enable RLS on the table
ALTER TABLE position_responsibilities ENABLE ROW LEVEL SECURITY;

-- Policy for inserting position responsibilities
CREATE POLICY "Users can insert own position responsibilities"
ON position_responsibilities
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_responsibilities.position_id
    AND c.user_id = auth.uid()
  )
);

-- Policy for selecting position responsibilities
CREATE POLICY "Users can read own position responsibilities"
ON position_responsibilities
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_responsibilities.position_id
    AND c.user_id = auth.uid()
  )
);

-- Policy for updating position responsibilities
CREATE POLICY "Users can update own position responsibilities"
ON position_responsibilities
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_responsibilities.position_id
    AND c.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_responsibilities.position_id
    AND c.user_id = auth.uid()
  )
);

-- Policy for deleting position responsibilities
CREATE POLICY "Users can delete own position responsibilities"
ON position_responsibilities
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_responsibilities.position_id
    AND c.user_id = auth.uid()
  )
);