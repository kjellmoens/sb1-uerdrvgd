/*
  # Update Certifications Schema

  1. Changes
    - Add company_id to certifications table
    - Migrate existing issuing organizations to companies table
    - Remove issuing_organization column
    - Add foreign key constraint

  2. Security
    - Maintain existing RLS policies
*/

-- First create companies for existing certification issuers
DO $$ 
BEGIN
  -- Create companies for any certification issuers that don't exist as companies
  INSERT INTO companies (name, description, industry, type, city, country_code)
  SELECT DISTINCT 
    c.issuing_organization,
    'Certification Provider',
    'Education',
    'Other',
    'Unknown', -- Default city
    'US' -- Default country code
  FROM certifications c
  LEFT JOIN companies comp ON comp.name = c.issuing_organization
  WHERE c.issuing_organization IS NOT NULL
    AND comp.id IS NULL;

  -- Add company_id column
  ALTER TABLE certifications
  ADD COLUMN company_id UUID REFERENCES companies(id);

  -- Update certifications to link to companies
  UPDATE certifications c
  SET company_id = comp.id
  FROM companies comp
  WHERE c.issuing_organization = comp.name;

  -- Make company_id required
  ALTER TABLE certifications
  ALTER COLUMN company_id SET NOT NULL;

  -- Remove issuing_organization column
  ALTER TABLE certifications
  DROP COLUMN issuing_organization;
END $$;