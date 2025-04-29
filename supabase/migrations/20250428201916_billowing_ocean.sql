/*
  # Update Trainings Schema

  1. Changes
    - Add company_id column to trainings table
    - Migrate existing provider data to companies table
    - Remove provider column
    - Add foreign key constraint

  2. Security
    - Maintain existing RLS policies
*/

-- First create companies for existing training providers
DO $$ 
BEGIN
  -- Create companies for any training providers that don't exist as companies
  INSERT INTO companies (name, description, industry, type, city, country_code)
  SELECT DISTINCT 
    t.provider,
    'Training Provider',
    'Education',
    'Other',
    'Unknown', -- Default city
    'US' -- Default country code
  FROM trainings t
  LEFT JOIN companies c ON c.name = t.provider
  WHERE t.provider IS NOT NULL
    AND c.id IS NULL;

  -- Add company_id column
  ALTER TABLE trainings
  ADD COLUMN company_id UUID REFERENCES companies(id);

  -- Update trainings to link to companies
  UPDATE trainings t
  SET company_id = c.id
  FROM companies c
  WHERE t.provider = c.name;

  -- Make company_id required
  ALTER TABLE trainings
  ALTER COLUMN company_id SET NOT NULL;

  -- Remove provider column
  ALTER TABLE trainings
  DROP COLUMN provider;
END $$;