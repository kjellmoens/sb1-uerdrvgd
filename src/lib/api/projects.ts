import { supabase } from '../db';
import type { PositionProject } from '../../types';

export const projectsApi = {
  async save(positionId: string, projects: PositionProject[]): Promise<PositionProject[]> {
    // First delete any existing projects for this position
    const { error: deleteError } = await supabase
      .from('position_projects')
      .delete()
      .eq('position_id', positionId);

    if (deleteError) throw deleteError;

    if (projects.length === 0) return [];

    // Insert new projects
    const { data: savedProjects, error: insertError } = await supabase
      .from('position_projects')
      .insert(
        projects.map(project => ({
          position_id: positionId,
          name: project.name,
          role: project.role,
          start_date: project.startDate,
          end_date: project.endDate,
          current: project.current,
          description: project.description,
          link: project.link,
          company_id: project.company?.id
        }))
      )
      .select(`
        id,
        name,
        role,
        start_date,
        end_date,
        current,
        description,
        link,
        company:companies (
          id,
          name,
          city,
          country_code
        )
      `);

    if (insertError) throw insertError;
    if (!savedProjects) throw new Error('Failed to save projects');

    return savedProjects.map(project => ({
      id: project.id,
      name: project.name,
      role: project.role,
      startDate: project.start_date,
      endDate: project.end_date || null,
      current: project.current || false,
      description: project.description,
      link: project.link || '',
      company: project.company,
      responsibilities: [''],
      achievements: []
    }));
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('position_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};