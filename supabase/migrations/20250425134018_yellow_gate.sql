/*
  # Work Experience Schema Update

  1. Changes
    - Add updated_at columns and triggers
    - Enable RLS
    - Add policies for authenticated users

  2. Tables
    - work_experience
    - positions
    - position_responsibilities
    - position_achievements
*/

-- Add updated_at columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'work_experience' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE work_experience 
    ADD COLUMN updated_at timestamptz DEFAULT CURRENT_TIMESTAMP;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'positions' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE positions 
    ADD COLUMN updated_at timestamptz DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_work_experience_updated_at'
  ) THEN
    CREATE TRIGGER update_work_experience_updated_at
      BEFORE UPDATE ON work_experience
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_positions_updated_at'
  ) THEN
    CREATE TRIGGER update_positions_updated_at
      BEFORE UPDATE ON positions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable RLS
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for work_experience
CREATE POLICY "Users can read own work experience"
ON work_experience
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can insert own work experience"
ON work_experience
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can update own work experience"
ON work_experience
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

CREATE POLICY "Users can delete own work experience"
ON work_experience
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM cvs 
    WHERE id = cv_id
  )
);

-- Create policies for positions
CREATE POLICY "Users can read own positions"
ON positions
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    WHERE w.id = work_experience_id
  )
);

CREATE POLICY "Users can insert own positions"
ON positions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    WHERE w.id = work_experience_id
  )
);

CREATE POLICY "Users can update own positions"
ON positions
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    WHERE w.id = work_experience_id
  )
);

CREATE POLICY "Users can delete own positions"
ON positions
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT c.user_id 
    FROM cvs c
    JOIN work_experience w ON w.cv_id = c.id
    WHERE w.id = work_experience_id
  )
);

-- Create policies for position_responsibilities
CREATE POLICY "Users can read own position responsibilities"
ON position_responsibilities
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

CREATE POLICY "Users can insert own position responsibilities"
ON position_responsibilities
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

CREATE POLICY "Users can update own position responsibilities"
ON position_responsibilities
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

CREATE POLICY "Users can delete own position responsibilities"
ON position_responsibilities
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

-- Create policies for position_achievements
CREATE POLICY "Users can read own position achievements"
ON position_achievements
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

CREATE POLICY "Users can insert own position achievements"
ON position_achievements
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

CREATE POLICY "Users can update own position achievements"
ON position_achievements
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

CREATE POLICY "Users can delete own position achievements"
ON position_achievements
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