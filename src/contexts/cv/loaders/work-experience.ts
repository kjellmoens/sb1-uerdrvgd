import { supabase } from '../../../lib/db';

export async function loadWorkExperience(cvId: string) {
  // First fetch work experience data
  const { data: workExpData, error: workExpError } = await supabase
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
          company_id,
          project_skills (
            name,
            score,
            type
          )
        )
      )
    `)
    .eq('cv_id', cvId);

  if (workExpError) throw workExpError;

  // Transform the data to include technical and non-technical skills
  return workExpData?.map(exp => ({
    ...exp,
    positions: exp.positions?.map(pos => ({
      ...pos,
      position_projects: pos.position_projects?.map(proj => ({
        ...proj,
        technicalSkills: proj.project_skills
          ?.filter(skill => skill.type === 'technical')
          .map(skill => ({ name: skill.name, score: skill.score })) || [],
        nonTechnicalSkills: proj.project_skills
          ?.filter(skill => skill.type === 'non_technical')
          .map(skill => ({ name: skill.name, score: skill.score })) || []
      }))
    }))
  }));
}