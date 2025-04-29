import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/db';
import { CV } from '../../../types';
import { transformCV } from '../transforms';

interface LoadCVsError extends Error {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
}

export async function loadCVs(): Promise<CV[]> {
  try {
    const { data: cvs, error } = await supabase
      .from('cvs')
      .select(`
        *,
        personal_info (*),
        work_experience (
          *,
          company:companies (*),
          positions (
            *,
            projects:position_projects (
              *,
              company:companies (*),
              responsibilities:project_responsibilities (*),
              achievements:project_achievements (*)
            )
          )
        ),
        education (
          *,
          company:companies (*),
          skills:education_skills (
            skill:skills (*)
          )
        ),
        certifications (
          *,
          company:companies (*),
          skills:certification_skills (
            skill:skills (*)
          )
        ),
        trainings (
          *,
          company:companies (*),
          skills:training_skills (
            skill:skills (*)
          )
        ),
        languages (*),
        awards (*),
        testimonials (*),
        personality_tests (*)
      `);

    if (error) {
      const cvError: LoadCVsError = new Error('Failed to load CVs');
      cvError.code = error.code;
      cvError.details = error.details;
      cvError.hint = error.hint;
      throw cvError;
    }

    if (!cvs) {
      return [];
    }

    return cvs.map(cv => transformCV(cv));
  } catch (error) {
    console.error('Error in loadCVs:', error);
    throw error;
  }
}