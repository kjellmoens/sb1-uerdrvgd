import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CV } from '../types';
import { supabase } from '../lib/db';
import { loadCVs } from './cv/loaders';

interface CVContextType {
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

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [activeCvId, setActiveCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      await loadCVs({ setCvs, setLoading, setError });
    };

    loadData();
  }, []);

  const getCV = (id: string) => {
    return cvs.find(cv => cv.id === id);
  };

  const createCV = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        navigate('/login');
        return '';
      }

      // First ensure the user exists in the users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (userCheckError || !existingUser) {
        // Create the user if they don't exist
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: session.user.id,
            email: session.user.email
          }]);

        if (insertError) throw insertError;
      }

      // Create the CV
      const { data: cvData, error: createError } = await supabase
        .from('cvs')
        .insert([{ user_id: session.user.id }])
        .select()
        .single();

      if (createError) throw createError;
      if (!cvData) throw new Error('No data returned from CV creation');

      // Add the new CV to state
      setCvs(prev => [...prev, {
        id: cvData.id,
        createdAt: cvData.created_at,
        updatedAt: cvData.updated_at,
        personalInfo: {
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phone: '',
          street: '',
          streetNumber: '',
          postalCode: '',
          city: '',
          state: '',
          country: '',
          website: '',
          linkedin: '',
          github: '',
          title: '',
          birthdate: '',
          nationality: '',
          relationshipStatus: '',
          profileSummaries: []
        },
        workExperience: [],
        education: [],
        trainings: [],
        certifications: [],
        awards: [],
        testimonials: [],
        languages: [],
        skills: [],
        projects: [],
        personality: []
      }]);
      
      return cvData.id;
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

  const deleteCV = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
      createCV, 
      updateCV, 
      deleteCV, 
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