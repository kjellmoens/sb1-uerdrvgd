/*
  # Add country code to education table

  1. Changes
    - Add country_code column to education table
    - Add foreign key constraint to countries table
    - Add NOT NULL constraint to ensure data integrity
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'education' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE education 
    ADD COLUMN country_code character(2) NOT NULL;

    ALTER TABLE education
    ADD CONSTRAINT education_country_code_fkey
    FOREIGN KEY (country_code) REFERENCES countries(code);
  END IF;
END $$;