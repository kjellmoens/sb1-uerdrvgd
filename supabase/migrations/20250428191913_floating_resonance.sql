/*
  # Link Education to Companies Table

  1. Changes
    - Add company_id column to education table
    - Create foreign key relationship with companies table
    - Add migration function to handle existing data
*/

-- Add company_id to education table
ALTER TABLE education
ADD COLUMN company_id UUID REFERENCES companies(id);

-- Create function to migrate existing institution data
CREATE OR REPLACE FUNCTION migrate_education_institutions()
RETURNS void AS $$
DECLARE
  edu RECORD;
  new_company_id UUID;
BEGIN
  FOR edu IN 
    SELECT id, institution, location, country_code 
    FROM education 
    WHERE institution IS NOT NULL
  LOOP
    -- Try to find existing company
    SELECT id INTO new_company_id
    FROM companies
    WHERE name = edu.institution;

    -- If company doesn't exist, create it
    IF new_company_id IS NULL THEN
      INSERT INTO companies (
        name,
        description,
        industry,
        type,
        city,
        country_code
      ) VALUES (
        edu.institution,
        'Educational Institution',
        'Education',
        'Other',
        edu.location,
        edu.country_code
      )
      RETURNING id INTO new_company_id;
    END IF;

    -- Update education with company_id
    UPDATE education
    SET company_id = new_company_id
    WHERE id = edu.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_education_institutions();

-- Drop the migration function
DROP FUNCTION migrate_education_institutions();