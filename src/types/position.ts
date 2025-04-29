import { PositionProject } from './project';

export interface Position {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  projects: PositionProject[];
}