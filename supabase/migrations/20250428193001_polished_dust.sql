/*
  # Remove Country Code from Education Table

  1. Changes
    - Remove country_code column from education table
    - Update related code to use company relationship for location/country data
*/

-- Remove country_code column from education table
ALTER TABLE education
DROP COLUMN IF EXISTS country_code;