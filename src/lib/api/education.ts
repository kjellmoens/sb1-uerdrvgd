import { supabase } from '../db';
import { Education } from '../../types';

export const educationApi = {
  async list(cvId: string): Promise<Education[]> {
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
        companies (
          id,
          name,
          city,
          country_code
        ),
        education_skills (
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
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching education:', error);
      throw new Error('Failed to fetch education');
    }

    return data.map(edu => ({
      id: edu.id,
      degree: edu.degree,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.start_date,
      endDate: edu.end_date || '',
      current: edu.current || false,
      description: edu.description || '',
      company: edu.companies,
      skills: edu.education_skills?.map(es => es.skills) ?? []
    }));
  },

  async save(cvId: string, education: Education[]): Promise<Education[]> {
    // First, delete all existing education entries for this CV
    const { error: deleteError } = await supabase
      .from('education')
      .delete()
      .eq('cv_id', cvId);

    if (deleteError) {
      console.error('Error deleting existing education:', deleteError);
      throw new Error('Failed to update education');
    }

    // Then insert all new/updated education entries
    const { data: savedEducation, error: insertError } = await supabase
      .from('education')
      .insert(
        education.map(edu => ({
          cv_id: cvId,
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy,
          start_date: edu.startDate,
          end_date: edu.current ? null : edu.endDate,
          current: edu.current,
          description: edu.description,
          company_id: edu.company.id
        }))
      )
      .select();

    if (insertError) {
      console.error('Error inserting education:', insertError);
      throw new Error('Failed to save education');
    }

    // Save education skills
    for (const edu of education) {
      const savedEdu = savedEducation.find(se => se.degree === edu.degree && se.field_of_study === edu.fieldOfStudy);
      if (!savedEdu || !edu.skills.length) continue;

      const { error: skillsError } = await supabase
        .from('education_skills')
        .insert(
          edu.skills.map(skill => ({
            education_id: savedEdu.id,
            skill_id: skill.id
          }))
        );

      if (skillsError) {
        throw new Error('Failed to save education skills');
      }
    }

    // Fetch the complete education data
    return this.list(cvId);
  }
};