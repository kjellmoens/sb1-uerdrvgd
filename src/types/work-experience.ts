import { Company } from './company';
import { Position } from './position';

export interface WorkExperience {
  id: string;
  company: Company;
  description: string;
  positions: Position[];
}