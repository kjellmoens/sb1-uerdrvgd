/*
  # Remove Institution Column from Education Table

  1. Changes
    - Create companies for existing institution entries
    - Link education records to companies
    - Remove institution column
*/

-- First ensure all education entries have a company_id
DO $$ 
BEGIN
  -- Create companies for any education entries that don't have one
  INSERT INTO companies (name, description, industry, type, city, country_code)
  SELECT DISTINCT 
    e.institution,
    'Educational Institution',
    'Education',
    'Other',
    'Unknown', -- Default city since location column doesn't exist
    'US' -- Default country code
  FROM education e
  LEFT JOIN companies c ON c.name = e.institution
  WHERE e.institution IS NOT NULL
    AND e.company_id IS NULL
    AND c.id IS NULL;

  -- Update education entries to link to companies
  UPDATE education e
  SET company_id = c.id
  FROM companies c
  WHERE e.institution = c.name
    AND e.company_id IS NULL;
END $$;

-- Make company_id required
ALTER TABLE education
ALTER COLUMN company_id SET NOT NULL;

-- Remove institution column
ALTER TABLE education
DROP COLUMN IF EXISTS institution;