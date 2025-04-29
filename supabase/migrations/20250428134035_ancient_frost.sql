/*
  # Add description column to work_experience table

  1. Changes
    - Add description column to work_experience table
*/

-- Add description column if it doesn't exist
ALTER TABLE work_experience
ADD COLUMN IF NOT EXISTS description TEXT;