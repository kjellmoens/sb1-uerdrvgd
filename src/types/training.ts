import { Company } from './company';
import { Skill } from './skill';

export interface Training {
  id: string;
  title: string;
  completionDate: string;
  description: string;
  company: Company;
  skills: Skill[];
}