/*
  # Add Skills to Training and Education

  1. Changes
    - Create training_skills and education_skills tables
    - Add foreign key relationships
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create training_skills table
CREATE TABLE IF NOT EXISTS training_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(training_id, skill_id)
);

-- Create education_skills table
CREATE TABLE IF NOT EXISTS education_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  education_id UUID NOT NULL REFERENCES education(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(education_id, skill_id)
);

-- Create updated_at triggers
CREATE TRIGGER update_training_skills_updated_at
  BEFORE UPDATE ON training_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_skills_updated_at
  BEFORE UPDATE ON education_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE training_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for training_skills
CREATE POLICY "Users can read own training skills"
ON training_skills
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN trainings t ON t.cv_id = c.id
    WHERE t.id = training_skills.training_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own training skills"
ON training_skills
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN trainings t ON t.cv_id = c.id
    WHERE t.id = training_skills.training_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own training skills"
ON training_skills
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN trainings t ON t.cv_id = c.id
    WHERE t.id = training_skills.training_id
    AND c.user_id = auth.uid()
  )
);

-- Create policies for education_skills
CREATE POLICY "Users can read own education skills"
ON education_skills
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN education e ON e.cv_id = c.id
    WHERE e.id = education_skills.education_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own education skills"
ON education_skills
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN education e ON e.cv_id = c.id
    WHERE e.id = education_skills.education_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own education skills"
ON education_skills
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN education e ON e.cv_id = c.id
    WHERE e.id = education_skills.education_id
    AND c.user_id = auth.uid()
  )
);