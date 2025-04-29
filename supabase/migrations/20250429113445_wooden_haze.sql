/*
  # Remove skill_scores table and references

  1. Changes
    - Drop skill_scores table if it exists
*/

-- Drop skill_scores table if it exists
DROP TABLE IF EXISTS skill_scores CASCADE;