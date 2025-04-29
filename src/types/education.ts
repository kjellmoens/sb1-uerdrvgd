import { Company } from './company';
import { Skill } from './skill';

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  company: Company;
  skills: Skill[];
}