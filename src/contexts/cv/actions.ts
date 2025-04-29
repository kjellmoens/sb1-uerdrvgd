import { supabase } from '../../lib/db';
import { NavigateFunction } from 'react-router-dom';
import { CV } from '../../types';

interface CreateCVParams {
  navigate: NavigateFunction;
  setCvs: React.Dispatch<React.SetStateAction<CV[]>>;
}

export async function createCV({ navigate, setCvs }: CreateCVParams): Promise<string> {
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
}

export async function deleteCV(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error('Failed to delete CV');
    }
  } catch (error) {
    console.error('Delete CV error:', error);
    throw new Error('Failed to delete CV');
  }
}