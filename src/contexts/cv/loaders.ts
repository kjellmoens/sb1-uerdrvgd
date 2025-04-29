import { supabase } from '../../lib/db';
import { transformCV } from './transforms';

interface LoadCVsParams {
  setCvs: (cvs: CV[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export async function loadCVs({ setCvs, setLoading, setError }: LoadCVsParams) {
  try {
    setLoading(true);
    setError(null);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      setLoading(false);
      return;
    }

    // Get basic CV data first
    const { data: basicCVData, error: basicCVError } = await supabase
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
          website,
          linkedin,
          github,
          title,
          birthdate,
          nationality_code,
          countries (nationality),
          relationship_status,
          profile_summaries (id, content)
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (basicCVError) throw basicCVError;

    // For each CV, fetch additional data separately
    const fullCVsData = await Promise.all((basicCVData || []).map(async (cv) => {
      const [workExp, education, certifications, trainings, languages, awards, testimonials, personality] = await Promise.all([
        // Fetch work experience
        supabase
          .from('work_experience')
          .select(`
            id,
            description,
            company_id,
            companies (
              id, name, description, industry, website, city, country_code
            ),
            positions (
              id, title, start_date, end_date, current, description,
              position_responsibilities (content),
              position_achievements (content),
              position_projects (
                id, name, role, start_date, end_date, current, description, link,
                company_id
              )
            )
          `)
          .eq('cv_id', cv.id),

        // Fetch education
        supabase
          .from('education')
          .select(`
            id,
            degree,
            field_of_study,
            start_date,
            end_date,
            current,
            description,
            companies (
              id, name, city, country_code
            )
          `)
          .eq('cv_id', cv.id),

        // Fetch certifications
        supabase
          .from('certifications')
          .select('*')
          .eq('cv_id', cv.id),

        // Fetch trainings
        supabase
          .from('trainings')
          .select('*')
          .eq('cv_id', cv.id),

        // Fetch languages
        supabase
          .from('languages')
          .select('*')
          .eq('cv_id', cv.id),

        // Fetch awards
        supabase
          .from('awards')
          .select('*')
          .eq('cv_id', cv.id),

        // Fetch testimonials
        supabase
          .from('testimonials')
          .select('*')
          .eq('cv_id', cv.id),

        // Fetch personality tests
        supabase
          .from('personality_tests')
          .select('*')
          .eq('cv_id', cv.id)
      ]);

      return transformCV(cv, workExp.data, education.data, certifications.data, trainings.data, languages.data, awards.data, testimonials.data, personality.data);
    }));

    setCvs(fullCVsData);
  } catch (err) {
    console.error('Error loading CVs:', err);
    setError(err instanceof Error ? err.message : 'Failed to load CVs');
  } finally {
    setLoading(false);
  }
}