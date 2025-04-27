/*
  # Add Awards Table and Policies

  1. Changes
    - Create awards table with proper structure
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  category TEXT,
  level TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

CREATE TRIGGER update_awards_updated_at
  BEFORE UPDATE ON awards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own awards"
  ON awards
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can insert own awards"
  ON awards
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can update own awards"
  ON awards
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );

CREATE POLICY "Users can delete own awards"
  ON awards
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM cvs 
      WHERE id = cv_id
    )
  );