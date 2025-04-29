/*
  # Update Project Schema

  1. Changes
    - Drop projects table and its dependencies
    - Update project_responsibilities, project_achievements, and project_skills to reference position_projects
    - Add company, location, country columns to position_projects table

  2. Security
    - Update RLS policies to reflect new structure
*/

-- First drop the dependent tables
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS project_achievements CASCADE;
DROP TABLE IF EXISTS project_responsibilities CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Add new columns to position_projects
ALTER TABLE position_projects
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Recreate project tables with references to position_projects
CREATE TABLE IF NOT EXISTS project_responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES position_projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES position_projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES position_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'non_technical')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at triggers
CREATE TRIGGER update_project_responsibilities_updated_at
  BEFORE UPDATE ON project_responsibilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_achievements_updated_at
  BEFORE UPDATE ON project_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_skills_updated_at
  BEFORE UPDATE ON project_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE project_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for project_responsibilities
CREATE POLICY "Users can read own project responsibilities"
ON project_responsibilities
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

CREATE POLICY "Users can insert own project responsibilities"
ON project_responsibilities
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

CREATE POLICY "Users can update own project responsibilities"
ON project_responsibilities
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

CREATE POLICY "Users can delete own project responsibilities"
ON project_responsibilities
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

-- Create policies for project_achievements
CREATE POLICY "Users can read own project achievements"
ON project_achievements
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

CREATE POLICY "Users can insert own project achievements"
ON project_achievements
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

CREATE POLICY "Users can update own project achievements"
ON project_achievements
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

CREATE POLICY "Users can delete own project achievements"
ON project_achievements
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

-- Create policies for project_skills
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