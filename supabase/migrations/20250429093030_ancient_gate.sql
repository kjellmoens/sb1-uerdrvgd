/*
  # Make Skill Description Optional

  1. Changes
    - Remove NOT NULL constraint from description column in skills table
*/

-- Make description optional
ALTER TABLE skills
ALTER COLUMN description DROP NOT NULL;