import { CV } from '../../types';

export function transformCV(
  cv: any,
  workExpData: any[],
  educationData: any[],
  certificationsData: any[],
  trainingsData: any[],
  languagesData: any[],
  awardsData: any[],
  testimonialsData: any[],
  personalityData: any[]
): CV {
  return {
    id: cv.id,
    createdAt: cv.created_at,
    updatedAt: cv.updated_at,
    personalInfo: cv.personal_info ? {
      firstName: cv.personal_info.first_name,
      middleName: cv.personal_info.middle_name || '',
      lastName: cv.personal_info.last_name,
      email: cv.personal_info.email,
      phone: cv.personal_info.phone,
      street: cv.personal_info.street,
      streetNumber: cv.personal_info.street_number,
      postalCode: cv.personal_info.postal_code,
      city: cv.personal_info.city,
      state: cv.personal_info.state || '',
      country: cv.personal_info.country,
      website: cv.personal_info.website || '',
      linkedin: cv.personal_info.linkedin || '',
      github: cv.personal_info.github || '',
      title: cv.personal_info.title,
      birthdate: cv.personal_info.birthdate,
      nationality: cv.personal_info.nationality,
      relationshipStatus: cv.personal_info.relationship_status,
      profileSummaries: cv.personal_info.profile_summaries || [],
      countries: cv.personal_info.countries
    } : {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      streetNumber: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
      website: '',
      linkedin: '',
      github: '',
      title: '',
      birthdate: '',
      nationality: '',
      relationshipStatus: '',
      profileSummaries: []
    },
    workExperience: workExpData?.map(exp => ({
      id: exp.id,
      company: exp.companies?.name || '',
      location: exp.companies?.city || '',
      sector: exp.companies?.industry || '',
      description: exp.companies?.description || '',
      url: exp.companies?.website || '',
      positions: exp.positions?.map((pos: any) => ({
        id: pos.id,
        title: pos.title,
        startDate: pos.start_date,
        endDate: pos.end_date || '',
        current: pos.current || false,
        description: pos.description,
        responsibilities: pos.position_responsibilities?.map((r: any) => r.content) || [''],
        achievements: pos.position_achievements?.map((a: any) => a.content) || [],
        projects: pos.position_projects?.map((proj: any) => ({
          id: proj.id,
          name: proj.name,
          role: proj.role,
          startDate: proj.start_date,
          endDate: proj.end_date || '',
          current: proj.current || false,
          description: proj.description,
          link: proj.link || '',
          company: proj.companies,
          responsibilities: [''],
          achievements: []
        })) || []
      })) || []
    })) || [],
    education: educationData?.map(edu => ({
      id: edu.id,
      degree: edu.degree,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.start_date,
      endDate: edu.end_date || '',
      current: edu.current || false,
      description: edu.description || '',
      company: edu.companies,
      skills: edu.education_skills?.map(es => es.skills) ?? []
    })) || [],
    trainings: trainingsData?.map(training => ({
      id: training.id,
      title: training.title,
      completionDate: training.completion_date,
      description: training.description,
      company: training.companies,
      skills: training.training_skills?.map(ts => ts.skills) ?? []
    })) || [],
    certifications: certificationsData?.map(cert => ({
      id: cert.id,
      name: cert.name,
      issueDate: cert.issue_date,
      expirationDate: cert.expiration_date || '',
      credentialId: cert.credential_id || '',
      credentialURL: cert.credential_url || '',
      company: cert.companies,
      skills: cert.certification_skills?.map(cs => cs.skills) ?? []
    })) || [],
    awards: awardsData || [],
    testimonials: testimonialsData || [],
    languages: languagesData || [],
    skills: [],
    projects: [],
    personality: personalityData?.map(test => ({
      id: test.id,
      type: test.type,
      completionDate: test.completion_date,
      provider: test.provider,
      description: test.description,
      reportUrl: test.report_url,
      trait: test.trait,
      score: test.score
    })) || []
  };
}