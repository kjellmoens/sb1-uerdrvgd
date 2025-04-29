import { Company } from './company';
import { Skill } from './skill';

export interface Certification {
  id: string;
  name: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialURL?: string;
  company: Company;
  skills: Skill[];
}