/*
  # Add Skill Scores Table for Projects

  1. Changes
    - Create skill_scores table with proper structure
    - Add foreign key relationship to position_projects
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create skill_scores table
CREATE TABLE IF NOT EXISTS skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES position_projects(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'non_technical')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = skill_scores.project_id
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
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = skill_scores.project_id
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
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = skill_scores.project_id
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
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = skill_scores.project_id
    AND c.user_id = auth.uid()
  )
);