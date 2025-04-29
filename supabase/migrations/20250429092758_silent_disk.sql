/*
  # Remove CV requirement from skills table

  1. Changes
    - Make cv_id column nullable in skills table
    - Update RLS policies to allow global skill management
    - Add indexes for better query performance

  2. Security
    - Maintain RLS policies for authenticated users
    - Allow global skill management without CV association
*/

-- Make cv_id nullable
ALTER TABLE skills ALTER COLUMN cv_id DROP NOT NULL;

-- Drop existing foreign key constraint
ALTER TABLE skills DROP CONSTRAINT skills_cv_id_fkey;

-- Add foreign key with ON DELETE SET NULL
ALTER TABLE skills 
  ADD CONSTRAINT skills_cv_id_fkey 
  FOREIGN KEY (cv_id) REFERENCES cvs(id) 
  ON DELETE SET NULL;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS skills_domain_idx ON skills (domain);
CREATE INDEX IF NOT EXISTS skills_subdomain_idx ON skills (subdomain);
CREATE INDEX IF NOT EXISTS skills_name_idx ON skills (name);

-- Update RLS policies for global skill management
DROP POLICY IF EXISTS "Anyone can read skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can create skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can delete skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can update skills" ON skills;

CREATE POLICY "Anyone can read skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage global skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (
    CASE 
      WHEN cv_id IS NULL THEN true  -- Allow management of global skills
      WHEN cv_id IS NOT NULL THEN   -- For CV-specific skills, check ownership
        EXISTS (
          SELECT 1 FROM cvs
          WHERE cvs.id = skills.cv_id
          AND cvs.user_id = auth.uid()
        )
    END
  )
  WITH CHECK (
    CASE 
      WHEN cv_id IS NULL THEN true  -- Allow management of global skills
      WHEN cv_id IS NOT NULL THEN   -- For CV-specific skills, check ownership
        EXISTS (
          SELECT 1 FROM cvs
          WHERE cvs.id = skills.cv_id
          AND cvs.user_id = auth.uid()
        )
    END
  );