/*
  # Initial Database Schema

  1. Tables
    - users
    - cvs
    - personal_info
    - work_experience
    - positions
    - projects
    - education
    - certifications
    - trainings
    - languages
    - personality_tests
    - personality_results
    - skills
    - awards
    - testimonials
    - companies

  2. Relationships
    - All tables have appropriate foreign key constraints
    - Cascading deletes where appropriate
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_cvs_updated_at
  BEFORE UPDATE ON cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Personal Info table
CREATE TABLE IF NOT EXISTS personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  street_number TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  title TEXT NOT NULL,
  birthdate DATE NOT NULL,
  nationality TEXT NOT NULL,
  relationship_status TEXT NOT NULL,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Profile Summaries table
CREATE TABLE IF NOT EXISTS profile_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_info_id UUID NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (personal_info_id) REFERENCES personal_info(id) ON DELETE CASCADE
);

-- Work Experience table
CREATE TABLE IF NOT EXISTS work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  sector TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_experience_id UUID NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  FOREIGN KEY (work_experience_id) REFERENCES work_experience(id) ON DELETE CASCADE
);

-- Position Responsibilities table
CREATE TABLE IF NOT EXISTS position_responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE
);

-- Position Achievements table
CREATE TABLE IF NOT EXISTS position_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID,
  cv_id UUID,
  name TEXT NOT NULL,
  role TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  link TEXT,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Project Responsibilities table
CREATE TABLE IF NOT EXISTS project_responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Project Achievements table
CREATE TABLE IF NOT EXISTS project_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  domain TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Skill Scores table
CREATE TABLE IF NOT EXISTS skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID,
  position_id UUID,
  skill_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'non_technical', 'general')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  location TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Trainings table
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  completion_date DATE NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL CHECK (proficiency IN (
    'Native',
    'Fluent (C2)',
    'Advanced (C1)',
    'Upper Intermediate (B2)',
    'Intermediate (B1)',
    'Elementary (A2)',
    'Beginner (A1)'
  )),
  certificate TEXT,
  certificate_date DATE,
  certificate_url TEXT,
  notes TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Personality Tests table
CREATE TABLE IF NOT EXISTS personality_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  type TEXT NOT NULL,
  completion_date DATE NOT NULL,
  provider TEXT,
  description TEXT,
  report_url TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Personality Results table
CREATE TABLE IF NOT EXISTS personality_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL,
  trait TEXT NOT NULL,
  score TEXT NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (test_id) REFERENCES personality_tests(id) ON DELETE CASCADE
);

-- Awards table
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  category TEXT,
  level TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  relationship TEXT NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  contact_info TEXT,
  linkedin_profile TEXT,
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  logo TEXT,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  founded TEXT CHECK (founded ~ '^\d{4}$'),
  size TEXT,
  type TEXT NOT NULL CHECK (type IN ('Public', 'Private', 'Nonprofit', 'Government', 'Other')),
  linkedin TEXT,
  twitter TEXT,
  facebook TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own CVs" ON cvs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CVs" ON cvs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs" ON cvs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs" ON cvs
  FOR DELETE USING (auth.uid() = user_id);