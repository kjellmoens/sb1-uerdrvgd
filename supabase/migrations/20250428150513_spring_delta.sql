-- Create function to safely remove company references
CREATE OR REPLACE FUNCTION remove_company_reference(company_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove company references from work experience
  UPDATE work_experience
  SET company_id = NULL
  WHERE company_id = $1;

  -- Remove company references from position projects
  UPDATE position_projects
  SET company_id = NULL
  WHERE company_id = $1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION remove_company_reference TO authenticated;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON companies;

-- Enable RLS on companies table
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY "Anyone can read companies"
  ON companies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete companies"
  ON companies
  FOR DELETE
  TO authenticated
  USING (true);