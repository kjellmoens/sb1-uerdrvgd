import { supabase } from '../../../lib/db';

export async function loadCertifications(cvId: string) {
  const { data, error } = await supabase
    .from('certifications')
    .select(`
      id,
      name,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
      company_id,
      companies (
        id, name, city, country_code
      ),
      certification_skills (
        skills (
          id, domain, subdomain, name, description
        )
      )
    `)
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}