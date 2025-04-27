import React, { createContext, useContext, useEffect, useState } from 'react';
import { CV } from '../types';
import { api } from '../lib/api';
import { supabase } from '../lib/db';
import { useNavigate } from 'react-router-dom';

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

  const loadCVs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user's session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        // Don't throw error here, just return as user might not be logged in
        setLoading(false);
        return;
      }

      // Fetch user's CVs with all related data
      const { data: cvsData, error: cvsError } = await supabase
        .from('cvs')
        .select(`
          id,
          created_at,
          updated_at,
          personal_info (
            id,
            first_name,
            middle_name,
            last_name,
            email,
            phone,
            street,
            street_number,
            postal_code,
            city,
            state,
            country,
            website,
            linkedin,
            github,
            title,
            birthdate,
            nationality,
            relationship_status,
            profile_summaries (
              id,
              content
            )
          ),
          work_experience (
            id,
            company,
            location,
            sector,
            description,
            url,
            positions (
              id,
              title,
              start_date,
              end_date,
              current,
              description,
              position_responsibilities (
                content
              ),
              position_achievements (
                content
              )
            )
          ),
          testimonials (
            id,
            author,
            role,
            company,
            relationship,
            date,
            content,
            contact_info,
            linkedin_profile
          ),
          awards (
            id,
            title,
            issuer,
            date,
            description,
            url,
            category,
            level
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cvsError) throw cvsError;

      // Transform the data to match our CV type
      const transformedCVs: CV[] = cvsData.map(cv => ({
        id: cv.id,
        createdAt: cv.created_at,
        updatedAt: cv.updated_at,
        personalInfo: cv.personal_info ? {
          firstName: cv.personal_info.first_name,
          middleName: cv.personal_info.middle_name || '',
          lastName: cv.personal_info.last_name,
          email: cv.personal_info.email,
          phone: cv.personal_info.phone,
          street: cv.personal_info.street,
          streetNumber: cv.personal_info.street_number,
          postalCode: cv.personal_info.postal_code,
          city: cv.personal_info.city,
          state: cv.personal_info.state || '',
          country: cv.personal_info.country,
          website: cv.personal_info.website || '',
          linkedin: cv.personal_info.linkedin || '',
          github: cv.personal_info.github || '',
          title: cv.personal_info.title,
          birthdate: cv.personal_info.birthdate,
          nationality: cv.personal_info.nationality,
          relationshipStatus: cv.personal_info.relationship_status,
          profileSummaries: cv.personal_info.profile_summaries || []
        } : {
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
        workExperience: cv.work_experience?.map(exp => ({
          id: exp.id,
          company: exp.company,
          location: exp.location,
          sector: exp.sector,
          description: exp.description,
          url: exp.url || '',
          positions: exp.positions?.map(pos => ({
            id: pos.id,
            title: pos.title,
            startDate: pos.start_date,
            endDate: pos.end_date || '',
            current: pos.current || false,
            description: pos.description,
            responsibilities: pos.position_responsibilities?.map(r => r.content) || [''],
            achievements: pos.position_achievements?.map(a => a.content) || [''],
            skills: [],
            projects: []
          })) || []
        })) || [],
        projects: [],
        trainings: [],
        certifications: [],
        education: [],
        awards: cv.awards || [],
        testimonials: cv.testimonials || [],
        personality: [],
        languages: [],
        skills: []
      }));

      setCvs(transformedCVs);
    } catch (err) {
      console.error('Error loading CVs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  // Load CVs when the component mounts
  useEffect(() => {
    loadCVs();
  }, []);

  const getCV = (id: string) => {
    return cvs.find(cv => cv.id === id);
  };

  const createCV = async () => {
    try {
      // Get the current user's session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        // Redirect to login page if not authenticated
        navigate('/login');
        return '';
      }

      // First ensure the user exists in the users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userCheckError || !existingUser) {
        // Create the user if they don't exist
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: user.id,
            email: user.email
          }]);

        if (insertError) throw insertError;
      }

      // Now create the CV with the verified user_id
      const { data: cvData, error: createError } = await supabase
        .from('cvs')
        .insert([{ user_id: user.id }])
        .select()
        .single();

      if (createError) throw createError;
      if (!cvData) throw new Error('No data returned from CV creation');

      const now = new Date().toISOString();
      const newCV: CV = {
        id: cvData.id,
        createdAt: now,
        updatedAt: now,
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
        projects: [],
        trainings: [],
        certifications: [],
        education: [],
        awards: [],
        testimonials: [],
        personality: [],
        languages: [],
        skills: []
      };
      
      setCvs(prev => [...prev, newCV]);
      setActiveCvId(cvData.id);
      
      // Return the actual CV ID from the database
      return cvData.id;
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error instanceof Error ? error : new Error('Failed to create CV');
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
      await api.cvs.delete(id);
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
    await loadCVs();
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