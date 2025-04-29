import { supabase } from '../db';
import type { WorkExperience } from '../../types';
import { projectsApi } from './projects';

export const workExperienceApi = {
  async list(cvId: string): Promise<WorkExperience[]> {
    // Fetch work experience entries with company info
    const { data: workExperiences, error: workExpError } = await supabase
      .from('work_experience')
      .select(`
        id,
        description,
        company:companies (
          id,
          name,
          description,
          industry,
          website,
          logo,
          founded,
          size,
          type,
          country_code,
          city
        ),
        positions (
          id,
          title,
          start_date,
          end_date,
          current,
          description,
          position_responsibilities (
            id,
            content
          ),
          position_achievements (
            id,
            content
          ),
          position_projects (
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
              description,
              industry,
              website,
              logo,
              founded,
              size,
              type,
              country_code,
              city
            ),
            project_responsibilities (
              id,
              content
            ),
            project_achievements (
              id,
              content
            ),
            project_skills (
              id,
              score
            )
          )
        )
      `)
      .eq('cv_id', cvId)
      .order('id', { ascending: true });

    if (workExpError) throw workExpError;

    return (workExperiences || []).map(exp => ({
      id: exp.id,
      description: exp.description,
      company: exp.company,
      positions: (exp.positions || []).map(pos => ({
        id: pos.id,
        title: pos.title,
        startDate: pos.start_date,
        endDate: pos.end_date,
        current: pos.current,
        description: pos.description,
        responsibilities: (pos.position_responsibilities || []).map(r => r.content),
        achievements: (pos.position_achievements || []).map(a => a.content),
        projects: (pos.position_projects || []).map(proj => ({
          id: proj.id,
          name: proj.name,
          role: proj.role,
          startDate: proj.start_date,
          endDate: proj.end_date,
          current: proj.current,
          description: proj.description,
          link: proj.link,
          company: proj.company,
          responsibilities: (proj.project_responsibilities || []).map(r => r.content),
          achievements: (proj.project_achievements || []).map(a => a.content),
          skills: (proj.project_skills || []).map(s => ({
            id: s.id,
            score: s.score
          }))
        }))
      }))
    }));
  },

  async save(cvId: string, experiences: WorkExperience[]): Promise<void> {
    // Delete existing work experience
    const { error: deleteError } = await supabase
      .from('work_experience')
      .delete()
      .eq('cv_id', cvId);

    if (deleteError) throw deleteError;

    for (const exp of experiences) {
      // Create work experience
      const { data: workExp, error: workExpError } = await supabase
        .from('work_experience')
        .insert({
          cv_id: cvId,
          company_id: exp.company?.id,
          description: exp.description
        })
        .select('id')
        .single();

      if (workExpError) throw workExpError;
      if (!workExp) throw new Error('Failed to create work experience');

      // Create positions
      for (const pos of exp.positions) {
        const { data: position, error: posError } = await supabase
          .from('positions')
          .insert({
            work_experience_id: workExp.id,
            title: pos.title,
            start_date: pos.startDate,
            end_date: pos.endDate,
            current: pos.current,
            description: pos.description
          })
          .select('id')
          .single();

        if (posError) throw posError;
        if (!position) throw new Error('Failed to create position');

        // Save responsibilities
        if (pos.responsibilities && pos.responsibilities.length > 0) {
          const validResponsibilities = pos.responsibilities.filter(r => r.trim());
          if (validResponsibilities.length > 0) {
            const { error: respError } = await supabase
              .from('position_responsibilities')
              .insert(
                validResponsibilities.map(content => ({
                  position_id: position.id,
                  content: content.trim()
                }))
              );

            if (respError) throw respError;
          }
        }

        // Save achievements
        if (pos.achievements && pos.achievements.length > 0) {
          const validAchievements = pos.achievements.filter(a => a.trim());
          if (validAchievements.length > 0) {
            const { error: achieveError } = await supabase
              .from('position_achievements')
              .insert(
                validAchievements.map(content => ({
                  position_id: position.id,
                  content: content.trim()
                }))
              );

            if (achieveError) throw achieveError;
          }
        }

        // Save projects
        if (pos.projects && pos.projects.length > 0) {
          await projectsApi.save(position.id, pos.projects);
        }
      }
    }
  }
};