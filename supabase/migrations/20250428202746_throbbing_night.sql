/*
  # Add Skills to Certifications

  1. Changes
    - Create certification_skills table
    - Add foreign key relationships
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create certification_skills table
CREATE TABLE IF NOT EXISTS certification_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(certification_id, skill_id)
);

-- Create updated_at trigger
CREATE TRIGGER update_certification_skills_updated_at
  BEFORE UPDATE ON certification_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE certification_skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own certification skills"
ON certification_skills
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN certifications cert ON cert.cv_id = c.id
    WHERE cert.id = certification_skills.certification_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own certification skills"
ON certification_skills
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN certifications cert ON cert.cv_id = c.id
    WHERE cert.id = certification_skills.certification_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own certification skills"
ON certification_skills
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cvs c
    JOIN certifications cert ON cert.cv_id = c.id
    WHERE cert.id = certification_skills.certification_id
    AND c.user_id = auth.uid()
  )
);