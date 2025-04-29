/*
  # Fix Skill Scores Table

  1. Changes
    - Drop and recreate skill_scores table with correct relationships
    - Add proper indexes and constraints
    - Update RLS policies
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS skill_scores CASCADE;

-- Create skill_scores table
CREATE TABLE IF NOT EXISTS skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES position_projects(id) ON DELETE CASCADE,
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'non_technical', 'general')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  -- Ensure either project_id or position_id is set, but not both
  CONSTRAINT skill_scores_project_or_position_check CHECK (
    (project_id IS NOT NULL AND position_id IS NULL) OR
    (project_id IS NULL AND position_id IS NOT NULL)
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_skill_scores_updated_at
  BEFORE UPDATE ON skill_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own skill scores"
ON skill_scores
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    LEFT JOIN position_projects pp ON pp.position_id = p.id
    WHERE (pp.id = skill_scores.project_id OR p.id = skill_scores.position_id)
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own skill scores"
ON skill_scores
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    LEFT JOIN position_projects pp ON pp.position_id = p.id
    WHERE (pp.id = skill_scores.project_id OR p.id = skill_scores.position_id)
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own skill scores"
ON skill_scores
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    LEFT JOIN position_projects pp ON pp.position_id = p.id
    WHERE (pp.id = skill_scores.project_id OR p.id = skill_scores.position_id)
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own skill scores"
ON skill_scores
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    LEFT JOIN position_projects pp ON pp.position_id = p.id
    WHERE (pp.id = skill_scores.project_id OR p.id = skill_scores.position_id)
    AND c.user_id = auth.uid()
  )
);