import { CV } from '../../types';

export interface CVContextType {
  cvs: CV[];
  activeCvId: string | null;
  getCV: (id: string) => CV | undefined;
  createCV: () => Promise<string>;
  updateCV: (id: string, data: Partial<CV>) => void;
  deleteCV: (id: string) => Promise<void>;
  setActiveCvId: (id: string | null) => void;
  loading: boolean;
  error: string | null;
  refreshCVs: () => Promise<void>;
}