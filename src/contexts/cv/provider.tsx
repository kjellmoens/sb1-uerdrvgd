import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CV } from '../../types';
import { CVContextType } from './types';
import { loadCVs } from './loaders';
import { createCV, deleteCV } from './actions';

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [activeCvId, setActiveCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    loadCVs({ setCvs, setLoading, setError });
  }, []);

  const getCV = (id: string) => {
    return cvs.find(cv => cv.id === id);
  };

  const handleCreateCV = async () => {
    try {
      const id = await createCV({ navigate, setCvs });
      setActiveCvId(id);
      return id;
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error;
    }
  };

  const updateCV = (id: string, data: Partial<CV>) => {
    setCvs(prev => 
      prev.map(cv => 
        cv.id === id 
          ? { 
              ...cv, 
              ...data, 
              updatedAt: new Date().toISOString() 
            } 
          : cv
      )
    );
  };

  const handleDeleteCV = async (id: string) => {
    try {
      await deleteCV(id);
      setCvs(prev => prev.filter(cv => cv.id !== id));
      if (activeCvId === id) {
        setActiveCvId(null);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw new Error('Failed to delete CV');
    }
  };

  const refreshCVs = async () => {
    await loadCVs({ setCvs, setLoading, setError });
  };

  return (
    <CVContext.Provider value={{ 
      cvs, 
      activeCvId, 
      getCV, 
      createCV: handleCreateCV, 
      updateCV, 
      deleteCV: handleDeleteCV, 
      setActiveCvId,
      loading,
      error,
      refreshCVs
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};