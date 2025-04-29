/*
  # Fix Position Responsibilities Policies

  1. Changes
    - Drop existing policies
    - Re-enable RLS
    - Create new policies with proper user authentication checks

  2. Security
    - Ensure users can only access their own position responsibilities
    - Verify user ownership through cv_id relationship
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own position responsibilities" ON position_responsibilities;
DROP POLICY IF EXISTS "Users can read own position responsibilities" ON position_responsibilities;
DROP POLICY IF EXISTS "Users can update own position responsibilities" ON position_responsibilities;
DROP POLICY IF EXISTS "Users can delete own position responsibilities" ON position_responsibilities;

-- Enable RLS
ALTER TABLE position_responsibilities ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
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
);

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