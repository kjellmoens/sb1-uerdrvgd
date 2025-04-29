import { supabase } from '../../../lib/db';

export async function loadEducation(cvId: string) {
  const { data, error } = await supabase
    .from('education')
    .select(`
      id,
      degree,
      field_of_study,
      start_date,
      end_date,
      current,
      description,
      company_id,
      companies (
        id, name, city, country_code
      ),
      education_skills (
        skills (
          id, domain, subdomain, name, description
        )
      )
    `)
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}