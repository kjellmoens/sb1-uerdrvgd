/*
  # Fix Position Achievements RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-enable RLS
    - Create new policies for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own position achievements" ON position_achievements;
DROP POLICY IF EXISTS "Users can insert own position achievements" ON position_achievements;
DROP POLICY IF EXISTS "Users can update own position achievements" ON position_achievements;
DROP POLICY IF EXISTS "Users can delete own position achievements" ON position_achievements;

-- Enable RLS
ALTER TABLE position_achievements ENABLE ROW LEVEL SECURITY;

-- Policy for selecting position achievements
CREATE POLICY "Users can read own position achievements"
ON position_achievements
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_achievements.position_id
  )
);

-- Policy for inserting position achievements
CREATE POLICY "Users can insert own position achievements"
ON position_achievements
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT c.user_id
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_achievements.position_id
  )
);

-- Policy for updating position achievements
CREATE POLICY "Users can update own position achievements"
ON position_achievements
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_achievements.position_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT c.user_id
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_achievements.position_id
  )
);

-- Policy for deleting position achievements
CREATE POLICY "Users can delete own position achievements"
ON position_achievements
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_achievements.position_id
  )
);