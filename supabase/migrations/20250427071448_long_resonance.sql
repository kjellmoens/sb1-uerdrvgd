/*
  # Add Testimonials Table and Policies

  1. Changes
    - Create testimonials table with proper structure
    - Enable RLS
    - Add policies for authenticated users

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own testimonials
*/

-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  relationship TEXT NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  contact_info TEXT,
  linkedin_profile TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own testimonials"
ON testimonials
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can insert own testimonials"
ON testimonials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can update own testimonials"
ON testimonials
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can delete own testimonials"
ON testimonials
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);