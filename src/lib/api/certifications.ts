import { supabase } from '../db';
import { Certification } from '../../types';

export const certificationsApi = {
  async list(cvId: string): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select(`
        id,
        name,
        issue_date,
        expiration_date,
        credential_id,
        credential_url,
        companies (
          id,
          name,
          city,
          country_code
        ),
        certification_skills (
          skills (
            id,
            domain,
            subdomain,
            name,
            description
          )
        )
      `)
      .eq('cv_id', cvId)
      .order('issue_date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching certifications: ${error.message}`);
    }

    return data.map(cert => ({
      id: cert.id,
      name: cert.name,
      issueDate: cert.issue_date,
      expirationDate: cert.expiration_date || '',
      credentialId: cert.credential_id || '',
      credentialURL: cert.credential_url || '',
      company: cert.companies,
      skills: cert.certification_skills?.map(cs => cs.skills) ?? []
    }));
  },

  async save(cvId: string, certifications: Certification[]): Promise<Certification[]> {
    // First, delete all existing certifications for this CV
    const { error: deleteError } = await supabase
      .from('certifications')
      .delete()
      .eq('cv_id', cvId);

    if (deleteError) {
      throw new Error(`Error deleting existing certifications: ${deleteError.message}`);
    }

    // Then insert the new certifications
    const { data: savedCerts, error: insertError } = await supabase
      .from('certifications')
      .insert(
        certifications.map(cert => ({
          cv_id: cvId,
          name: cert.name,
          issue_date: cert.issueDate,
          expiration_date: cert.expirationDate || null,
          credential_id: cert.credentialId || null,
          credential_url: cert.credentialURL || null,
          company_id: cert.company.id
        }))
      )
      .select();

    if (insertError) {
      throw new Error(`Error saving certifications: ${insertError.message}`);
    }

    // Save certification skills
    for (const cert of certifications) {
      const savedCert = savedCerts.find(sc => sc.name === cert.name);
      if (!savedCert || !cert.skills.length) continue;

      const { error: skillsError } = await supabase
        .from('certification_skills')
        .insert(
          cert.skills.map(skill => ({
            certification_id: savedCert.id,
            skill_id: skill.id
          }))
        );

      if (skillsError) {
        throw new Error(`Error saving certification skills: ${skillsError.message}`);
      }
    }

    // Fetch the complete certifications data
    return this.list(cvId);
  }
};