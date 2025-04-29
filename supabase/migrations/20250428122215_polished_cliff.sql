/*
  # Fix Position Projects Schema

  1. Changes
    - Add missing columns to position_projects table
    - Add triggers and policies
*/

-- Add missing columns to position_projects if they don't exist
ALTER TABLE position_projects
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;