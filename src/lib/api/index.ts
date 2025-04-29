import { companiesApi } from './companies';
import { personalInfoApi } from './personal-info';
import { projectsApi } from './projects';
import { workExperienceApi } from './work-experience';
import { educationApi } from './education';
import { skillsApi } from './skills';
import { personalityApi } from './personality';
import { certificationsApi } from './certifications';
import { trainingsApi } from './trainings';
import { languagesApi } from './languages';

export const api = {
  companies: companiesApi,
  personalInfo: personalInfoApi,
  projects: projectsApi,
  workExperience: workExperienceApi,
  education: educationApi,
  skills: skillsApi,
  personality: personalityApi,
  certifications: certificationsApi,
  trainings: trainingsApi,
  languages: languagesApi
};