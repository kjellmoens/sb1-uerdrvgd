/*
  # Add Unique Constraint to personal_info table

  1. Changes
    - Add unique constraint on cv_id column in personal_info table
    - This enables proper upsert operations using ON CONFLICT

  2. Security
    - No changes to RLS policies
*/

-- Add unique constraint to cv_id column
ALTER TABLE personal_info
ADD CONSTRAINT personal_info_cv_id_key UNIQUE (cv_id);