import { supabase } from '../db';
import { Training } from '../../types';

export const trainingsApi = {
  async list(cvId: string): Promise<Training[]> {
    const { data, error } = await supabase
      .from('trainings')
      .select(`
        id,
        title,
        completion_date,
        description,
        companies (
          id,
          name,
          city,
          country_code
        ),
        training_skills (
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
      .order('completion_date', { ascending: false });

    if (error) {
      throw new Error('Failed to load trainings');
    }

    return (data || []).map(training => ({
      id: training.id,
      title: training.title,
      completionDate: training.completion_date,
      description: training.description,
      company: training.companies,
      skills: training.training_skills?.map(ts => ts.skills) ?? []
    }));
  },

  async save(cvId: string, trainings: Training[]): Promise<Training[]> {
    // First delete existing trainings
    const { error: deleteError } = await supabase
      .from('trainings')
      .delete()
      .eq('cv_id', cvId);

    if (deleteError) {
      throw new Error('Failed to update trainings');
    }

    // Then insert new trainings if there are any
    if (trainings.length > 0) {
      const { data: savedTrainings, error: insertError } = await supabase
        .from('trainings')
        .insert(trainings.map(training => ({
          title: training.title,
          completion_date: training.completionDate,
          description: training.description,
          cv_id: cvId,
          company_id: training.company.id
        })))
        .select();

      if (insertError) {
        throw new Error('Failed to save trainings');
      }

      // Save training skills
      for (const training of trainings) {
        const savedTraining = savedTrainings.find(st => st.title === training.title);
        if (!savedTraining || !training.skills.length) continue;

        const { error: skillsError } = await supabase
          .from('training_skills')
          .insert(
            training.skills.map(skill => ({
              training_id: savedTraining.id,
              skill_id: skill.id
            }))
          );

        if (skillsError) {
          throw new Error('Failed to save training skills');
        }
      }

      // Fetch the complete trainings data
      return this.list(cvId);
    }

    return [];
  }
};