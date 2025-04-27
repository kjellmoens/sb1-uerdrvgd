/*
  # Add Position Projects Schema

  1. Changes
    - Create position_projects table
    - Add relationships to positions table
    - Enable RLS
    - Add policies for authenticated users

  2. Tables
    - position_projects
*/

-- Create position_projects table
CREATE TABLE IF NOT EXISTS position_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE TRIGGER update_position_projects_updated_at
  BEFORE UPDATE ON position_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE position_projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own position projects"
ON position_projects
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_id
  )
);

CREATE POLICY "Users can insert own position projects"
ON position_projects
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_id
  )
);

CREATE POLICY "Users can update own position projects"
ON position_projects
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_id
  )
);

CREATE POLICY "Users can delete own position projects"
ON position_projects
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    WHERE p.id = position_id
  )
);

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

-- Enable RLS
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own project skills"
ON project_skills
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_id
  )
);

CREATE POLICY "Users can insert own project skills"
ON project_skills
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_id
  )
);

CREATE POLICY "Users can update own project skills"
ON project_skills
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_id
  )
);

CREATE POLICY "Users can delete own project skills"
ON project_skills
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    JOIN positions p ON p.work_experience_id = w.id
    JOIN position_projects pp ON pp.position_id = p.id
    WHERE pp.id = project_id
  )
);