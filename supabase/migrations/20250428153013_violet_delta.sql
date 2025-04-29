-- Make content optional in position_responsibilities
ALTER TABLE position_responsibilities
ALTER COLUMN content DROP NOT NULL;

-- Make content optional in position_achievements
ALTER TABLE position_achievements
ALTER COLUMN content DROP NOT NULL;

-- Make content optional in project_responsibilities
ALTER TABLE project_responsibilities
ALTER COLUMN content DROP NOT NULL;

-- Make content optional in project_achievements
ALTER TABLE project_achievements
ALTER COLUMN content DROP NOT NULL;