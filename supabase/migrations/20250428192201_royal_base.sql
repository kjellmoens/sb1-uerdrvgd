/*
  # Remove Location and Country Code from Education Table

  1. Changes
    - Remove location and country_code columns from education table
    - These fields are now handled through the companies relationship
*/

-- Remove columns that are now handled through companies relationship
ALTER TABLE education
DROP COLUMN IF EXISTS location,
DROP COLUMN IF EXISTS country_code;