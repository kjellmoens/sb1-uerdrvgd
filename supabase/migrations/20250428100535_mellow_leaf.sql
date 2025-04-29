/*
  # Add Projects Schema

  1. New Tables
    - projects
    - project_responsibilities
    - project_achievements
    - project_skills

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own project skills" ON project_skills;
  DROP POLICY IF EXISTS "Users can insert own project skills" ON project_skills;
  DROP POLICY IF EXISTS "Users can update own project skills" ON project_skills;
  DROP POLICY IF EXISTS "Users can delete own project skills" ON project_skills;
END $$;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create project_responsibilities table
CREATE TABLE IF NOT EXISTS project_responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create project_achievements table
CREATE TABLE IF NOT EXISTS project_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create project_skills table
CREATE TABLE IF NOT EXISTS project_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'non_technical')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at triggers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_project_responsibilities_updated_at'
  ) THEN
    CREATE TRIGGER update_project_responsibilities_updated_at
      BEFORE UPDATE ON project_responsibilities
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_project_achievements_updated_at'
  ) THEN
    CREATE TRIGGER update_project_achievements_updated_at
      BEFORE UPDATE ON project_achievements
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_project_skills_updated_at'
  ) THEN
    CREATE TRIGGER update_project_skills_updated_at
      BEFORE UPDATE ON project_skills
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can read own projects"
ON projects
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can insert own projects"
ON projects
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can update own projects"
ON projects
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can delete own projects"
ON projects
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

-- Create policies for project_responsibilities
CREATE POLICY "Users can read own project responsibilities"
ON project_responsibilities
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
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
    JOIN projects p ON p.cv_id = c.id
    WHERE p.id = project_id
  )
);