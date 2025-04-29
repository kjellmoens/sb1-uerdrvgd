/*
  # Make Responsibilities and Achievements Optional

  1. Changes
    - Remove NOT NULL constraint from content columns
    - Update default values in frontend code
*/

-- Make position_responsibilities content optional
ALTER TABLE position_responsibilities
ALTER COLUMN content DROP NOT NULL;

-- Make position_achievements content optional
ALTER TABLE position_achievements
ALTER COLUMN content DROP NOT NULL;

-- Make project_responsibilities content optional
ALTER TABLE project_responsibilities
ALTER COLUMN content DROP NOT NULL;

-- Make project_achievements content optional
ALTER TABLE project_achievements
ALTER COLUMN content DROP NOT NULL;