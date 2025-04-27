/*
  # Remove Row Level Security

  1. Changes
    - Disable RLS on all tables
    - Drop all existing policies
*/

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cvs DISABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE profile_summaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE positions DISABLE ROW LEVEL SECURITY;
ALTER TABLE position_responsibilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE position_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_responsibilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE education DISABLE ROW LEVEL SECURITY;
ALTER TABLE certifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainings DISABLE ROW LEVEL SECURITY;
ALTER TABLE languages DISABLE ROW LEVEL SECURITY;
ALTER TABLE personality_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE personality_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE awards DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DO $$ 
DECLARE
  _tbl text;
  _pol text;
BEGIN
  FOR _tbl IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    FOR _pol IN 
      SELECT policyname 
      FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = _tbl
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', _pol, _tbl);
    END LOOP;
  END LOOP;
END $$;