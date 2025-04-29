/*
  # Link Personal Info Nationality to Countries Table

  1. Changes
    - Add nationality_code column to personal_info table
    - Create foreign key relationship with countries table
    - Migrate existing nationality data
*/

-- First add the new column
ALTER TABLE personal_info
ADD COLUMN nationality_code CHAR(2) REFERENCES countries(code);

-- Create function to migrate existing nationality data
CREATE OR REPLACE FUNCTION migrate_nationality_data()
RETURNS void AS $$
DECLARE
  person RECORD;
  found_code CHAR(2);
BEGIN
  FOR person IN 
    SELECT id, nationality 
    FROM personal_info 
    WHERE nationality IS NOT NULL
  LOOP
    SELECT code INTO found_code
    FROM countries
    WHERE nationality = person.nationality;

    IF found_code IS NOT NULL THEN
      UPDATE personal_info
      SET nationality_code = found_code
      WHERE id = person.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_nationality_data();

-- Drop the migration function
DROP FUNCTION migrate_nationality_data();

-- Make the foreign key column required after migration
ALTER TABLE personal_info
ALTER COLUMN nationality_code SET NOT NULL;

-- Drop the old nationality column
ALTER TABLE personal_info
DROP COLUMN IF EXISTS nationality;