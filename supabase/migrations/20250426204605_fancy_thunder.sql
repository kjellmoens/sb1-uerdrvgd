/*
  # Add Languages Table and Policies

  1. Changes
    - Create languages table with proper structure
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create languages table if it doesn't exist
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL CHECK (proficiency IN (
    'Native',
    'Fluent (C2)',
    'Advanced (C1)',
    'Upper Intermediate (B2)',
    'Intermediate (B1)',
    'Elementary (A2)',
    'Beginner (A1)'
  )),
  certificate TEXT,
  certificate_date DATE,
  certificate_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE TRIGGER update_languages_updated_at
  BEFORE UPDATE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own languages"
ON languages
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can insert own languages"
ON languages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can update own languages"
ON languages
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can delete own languages"
ON languages
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);