import { supabase } from '../../../lib/db';

export async function loadTrainings(cvId: string) {
  const { data, error } = await supabase
    .from('trainings')
    .select(`
      id,
      title,
      completion_date,
      description,
      company_id,
      companies (
        id, name, city, country_code
      ),
      training_skills (
        skills (
          id, domain, subdomain, name, description
        )
      )
    `)
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}