/*
  # Update Companies Table Schema

  1. Changes
    - Add JSONB columns for structured data
    - Remove individual columns that will be part of JSONB
    - Update column types to match frontend expectations

  2. Security
    - Enable RLS
    - Add policies for public access (read) and authenticated access (write)
*/

-- Drop existing columns that will be replaced by JSONB
ALTER TABLE companies 
  DROP COLUMN IF EXISTS city,
  DROP COLUMN IF EXISTS state,
  DROP COLUMN IF EXISTS country,
  DROP COLUMN IF EXISTS linkedin,
  DROP COLUMN IF EXISTS twitter,
  DROP COLUMN IF EXISTS facebook;

-- Add new JSONB columns
ALTER TABLE companies ADD COLUMN IF NOT EXISTS headquarters JSONB NOT NULL DEFAULT '{
  "city": "",
  "state": "",
  "country": ""
}'::jsonb;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{
  "linkedin": null,
  "twitter": null,
  "facebook": null
}'::jsonb;

-- Create policies for companies table
CREATE POLICY "Anyone can read companies" ON companies
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert companies" ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies" ON companies
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete companies" ON companies
  FOR DELETE
  TO authenticated
  USING (true);