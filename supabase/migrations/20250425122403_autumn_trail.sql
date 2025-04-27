/*
  # Personal Information Schema Update

  1. Changes
    - Add personal_info table with all required fields
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  street_number TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  title TEXT NOT NULL,
  birthdate DATE NOT NULL,
  nationality TEXT NOT NULL,
  relationship_status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_info_id UUID NOT NULL REFERENCES personal_info(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own personal info"
  ON personal_info
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can insert own personal info"
  ON personal_info
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can update own personal info"
  ON personal_info
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can delete own personal info"
  ON personal_info
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

-- Profile summaries policies
CREATE POLICY "Users can read own profile summaries"
  ON profile_summaries
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT c.user_id 
      FROM cvs c
      JOIN personal_info p ON p.cv_id = c.id
      WHERE p.id = personal_info_id
    )
  );

CREATE POLICY "Users can insert own profile summaries"
  ON profile_summaries
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT c.user_id 
      FROM cvs c
      JOIN personal_info p ON p.cv_id = c.id
      WHERE p.id = personal_info_id
    )
  );

CREATE POLICY "Users can update own profile summaries"
  ON profile_summaries
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT c.user_id 
      FROM cvs c
      JOIN personal_info p ON p.cv_id = c.id
      WHERE p.id = personal_info_id
    )
  );

CREATE POLICY "Users can delete own profile summaries"
  ON profile_summaries
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT c.user_id 
      FROM cvs c
      JOIN personal_info p ON p.cv_id = c.id
      WHERE p.id = personal_info_id
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_personal_info_updated_at
  BEFORE UPDATE ON personal_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_summaries_updated_at
  BEFORE UPDATE ON profile_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();