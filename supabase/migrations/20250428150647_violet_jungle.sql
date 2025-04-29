/*
  # Deduplicate Companies and Add Unique Constraint

  1. Changes
    - Create function to handle company name uniqueness
    - Add case-insensitive unique constraint
    - Update references to use canonical company records
*/

-- Create a function to get or create canonical company record
CREATE OR REPLACE FUNCTION get_canonical_company(company_name text)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  canonical_id uuid;
BEGIN
  -- Try to find existing company with case-insensitive match
  SELECT id INTO canonical_id
  FROM companies
  WHERE lower(name) = lower(company_name)
  ORDER BY created_at
  LIMIT 1;

  RETURN canonical_id;
END;
$$;

-- Update work_experience references to use canonical companies
UPDATE work_experience w
SET company_id = (
  SELECT get_canonical_company(c.name)
  FROM companies c
  WHERE c.id = w.company_id
)
WHERE company_id IS NOT NULL;

-- Update position_projects references to use canonical companies
UPDATE position_projects p
SET company_id = (
  SELECT get_canonical_company(c.name)
  FROM companies c
  WHERE c.id = p.company_id
)
WHERE company_id IS NOT NULL;

-- Delete duplicate companies
DELETE FROM companies c1
WHERE EXISTS (
  SELECT 1
  FROM companies c2
  WHERE lower(c2.name) = lower(c1.name)
  AND c2.created_at < c1.created_at
);

-- Create unique index for case-insensitive company names
CREATE UNIQUE INDEX companies_name_lower_idx ON companies (lower(name));

-- Drop the function as it's no longer needed
DROP FUNCTION get_canonical_company(text);