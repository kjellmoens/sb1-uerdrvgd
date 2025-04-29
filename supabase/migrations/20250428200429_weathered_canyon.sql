/*
  # Remove Personality Test Results

  1. Changes
    - Drop personality_results table
    - Update personality_tests table structure
    - Remove references to test results
*/

-- Drop personality_results table
DROP TABLE IF EXISTS personality_results CASCADE;

-- Update personality_tests table to include score directly
ALTER TABLE personality_tests
ADD COLUMN score TEXT,
ADD COLUMN trait TEXT;