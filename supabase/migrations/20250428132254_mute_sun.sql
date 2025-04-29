/*
  # Update Project Company Schema

  1. Changes
    - Move company data from position_projects to companies table
    - Add company_id foreign key to position_projects
    - Remove old company columns from position_projects
*/

-- First ensure we have the companies table properly structured
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS headquarters JSONB NOT NULL DEFAULT '{
  "city": "",
  "state": "",
  "country": ""
}'::jsonb;

-- Add company_id to position_projects
ALTER TABLE position_projects
ADD COLUMN company_id UUID REFERENCES companies(id);

-- Create temporary function to migrate data
CREATE OR REPLACE FUNCTION migrate_project_companies()
RETURNS void AS $$
DECLARE
  project RECORD;
  new_company_id UUID;
BEGIN
  FOR project IN 
    SELECT id, company, location, country 
    FROM position_projects 
    WHERE company IS NOT NULL
  LOOP
    -- Try to find existing company
    SELECT id INTO new_company_id
    FROM companies
    WHERE name = project.company;

    -- If company doesn't exist, create it
    IF new_company_id IS NULL THEN
      INSERT INTO companies (
        name,
        description,
        industry,
        type,
        headquarters
      ) VALUES (
        project.company,
        'Automatically migrated from project data',
        'Unknown',
        'Private',
        jsonb_build_object(
          'city', project.location,
          'state', '',
          'country', project.country
        )
      )
      RETURNING id INTO new_company_id;
    END IF;

    -- Update project with company_id
    UPDATE position_projects
    SET company_id = new_company_id
    WHERE id = project.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_project_companies();

-- Drop the migration function
DROP FUNCTION migrate_project_companies();

-- Remove old columns
ALTER TABLE position_projects
DROP COLUMN IF EXISTS company,
DROP COLUMN IF EXISTS location,
DROP COLUMN IF EXISTS country;