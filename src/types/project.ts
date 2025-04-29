import { Company } from './company';

export interface PositionProject {
  id: string;
  name: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string;
  company?: Company;
  link?: string;
  responsibilities: string[];
  achievements: string[];
}