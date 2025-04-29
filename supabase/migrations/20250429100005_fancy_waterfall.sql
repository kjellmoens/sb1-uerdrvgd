/*
  # Replace skill_scores with project_skills table

  1. Changes
    - Drop skill_scores table
    - Create project_skills table with proper structure
    - Add RLS policies
    - Add indexes for performance
*/

-- Drop existing skill_scores table
DROP TABLE IF EXISTS skill_scores CASCADE;

-- Create project_skills table
CREATE TABLE IF NOT EXISTS project_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES position_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'non_technical')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE TRIGGER update_project_skills_updated_at
  BEFORE UPDATE ON project_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX project_skills_project_id_idx ON project_skills(project_id);
CREATE INDEX project_skills_type_idx ON project_skills(type);

-- Enable RLS
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own project skills"
ON project_skills
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_skills.project_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own project skills"
ON project_skills
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_skills.project_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own project skills"
ON project_skills
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_skills.project_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own project skills"
ON project_skills
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_skills.project_id
    AND c.user_id = auth.uid()
  )
);