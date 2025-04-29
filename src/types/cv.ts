import { Company } from './company';
import { Education } from './education';
import { Language } from './language';
import { PersonalInfo } from './personal-info';
import { Position } from './position';
import { PositionProject } from './project';
import { Skill } from './skill';
import { WorkExperience } from './work-experience';

export interface CV {
  id: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  trainings: any[];
  certifications: any[];
  awards: any[];
  testimonials: any[];
  languages: Language[];
  skills: Skill[];
  projects: any[];
  personality: any[];
}

export interface CVPreviewFlags {
  showTrainingDescription: boolean;
  showProjectDescription: boolean;
  showEducationDescription: boolean;
  showWorkDescription: boolean;
  showCompanyDescription: boolean;
  showBirthdate: boolean;
  showNationality: boolean;
  showRelationshipStatus: boolean;
  showStreetAddress: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showMiddleName: boolean;
}