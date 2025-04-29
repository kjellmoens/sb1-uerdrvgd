/*
  # Move Work Experience Companies to Companies Table

  1. Changes
    - Add company_id to work_experience table
    - Migrate existing company data to companies table
    - Link work_experience to companies via foreign key
    - Remove old company columns from work_experience

  2. Security
    - No changes to RLS policies
*/

-- First ensure we have the companies table properly structured
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS headquarters JSONB NOT NULL DEFAULT '{
  "city": "",
  "state": "",
  "country": ""
}'::jsonb;

-- Add company_id to work_experience
ALTER TABLE work_experience
ADD COLUMN company_id UUID REFERENCES companies(id);

-- Create temporary function to migrate data
CREATE OR REPLACE FUNCTION migrate_work_experience_companies()
RETURNS void AS $$
DECLARE
  work_exp RECORD;
  new_company_id UUID;
BEGIN
  FOR work_exp IN 
    SELECT id, company, location, sector 
    FROM work_experience 
    WHERE company IS NOT NULL
  LOOP
    -- Try to find existing company
    SELECT id INTO new_company_id
    FROM companies
    WHERE name = work_exp.company;

    -- If company doesn't exist, create it
    IF new_company_id IS NULL THEN
      INSERT INTO companies (
        name,
        description,
        industry,
        type,
        headquarters
      ) VALUES (
        work_exp.company,
        'Automatically migrated from work experience data',
        work_exp.sector,
        'Private',
        jsonb_build_object(
          'city', work_exp.location,
          'state', '',
          'country', ''
        )
      )
      RETURNING id INTO new_company_id;
    END IF;

    -- Update work experience with company_id
    UPDATE work_experience
    SET company_id = new_company_id
    WHERE id = work_exp.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_work_experience_companies();

-- Drop the migration function
DROP FUNCTION migrate_work_experience_companies();

-- Remove old columns
ALTER TABLE work_experience
DROP COLUMN IF EXISTS company,
DROP COLUMN IF EXISTS location;