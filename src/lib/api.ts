import { supabase } from './db';
import type { Company, Award, PersonalInfo, CV, ProfileSummary, WorkExperience, Position, Language, Training, Certification, Testimonial } from '../types';

export const api = {
  cvs: {
    list: async () => {
      const { data: cvsData, error: cvsError } = await supabase
        .from('cvs')
        .select(`
          id,
          created_at,
          updated_at,
          personal_info (
            id,
            first_name,
            middle_name,
            last_name,
            email,
            phone,
            street,
            street_number,
            postal_code,
            city,
            state,
            country,
            website,
            linkedin,
            github,
            title,
            birthdate,
            nationality,
            relationship_status,
            profile_summaries (
              id,
              content
            )
          ),
          work_experience (
            id,
            company,
            location,
            sector,
            description,
            url,
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
              )
            )
          ),
          testimonials (
            id,
            author,
            role,
            company,
            relationship,
            date,
            content,
            contact_info,
            linkedin_profile
          )
        `)
        .order('created_at', { ascending: false });

      if (cvsError) throw cvsError;

      // Transform the data to match the frontend structure
      return cvsData.map(cv => ({
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
          profileSummaries: cv.personal_info.profile_summaries || []
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
        workExperience: cv.work_experience?.map(exp => ({
          id: exp.id,
          company: exp.company,
          location: exp.location,
          sector: exp.sector,
          description: exp.description,
          url: exp.url || '',
          positions: exp.positions?.map(pos => ({
            id: pos.id,
            title: pos.title,
            startDate: pos.start_date,
            endDate: pos.end_date || '',
            current: pos.current || false,
            description: pos.description,
            responsibilities: pos.position_responsibilities?.map(r => r.content) || [''],
            achievements: pos.position_achievements?.map(a => a.content) || [''],
            skills: [],
            projects: []
          })) || []
        })) || [],
        projects: [],
        trainings: [],
        certifications: [],
        education: [],
        awards: [],
        testimonials: cv.testimonials || []
      }));
    },

    create: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('cvs')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  workExperience: {
    save: async (cvId: string, experiences: WorkExperience[]) => {
      try {
        // First, delete all existing work experience records for this CV
        const { error: deleteError } = await supabase
          .from('work_experience')
          .delete()
          .eq('cv_id', cvId);

        if (deleteError) throw deleteError;

        // Then insert new records
        for (const exp of experiences) {
          // Insert work experience
          const { data: workExp, error: workError } = await supabase
            .from('work_experience')
            .insert({
              cv_id: cvId,
              company: exp.company,
              location: exp.location,
              sector: exp.sector,
              description: exp.description,
              url: exp.url || null
            })
            .select()
            .single();

          if (workError) throw workError;

          // Insert positions
          for (const pos of exp.positions) {
            const { data: position, error: posError } = await supabase
              .from('positions')
              .insert({
                work_experience_id: workExp.id,
                title: pos.title,
                start_date: pos.startDate || null,
                end_date: pos.endDate || null,
                current: pos.current,
                description: pos.description
              })
              .select()
              .single();

            if (posError) throw posError;

            // Insert responsibilities
            if (pos.responsibilities.length > 0) {
              const { error: respError } = await supabase
                .from('position_responsibilities')
                .insert(
                  pos.responsibilities
                    .filter(content => content.trim() !== '')
                    .map(content => ({
                      position_id: position.id,
                      content
                    }))
                );

              if (respError) throw respError;
            }

            // Insert achievements
            if (pos.achievements.length > 0) {
              const { error: achieveError } = await supabase
                .from('position_achievements')
                .insert(
                  pos.achievements
                    .filter(content => content.trim() !== '')
                    .map(content => ({
                      position_id: position.id,
                      content
                    }))
                );

              if (achieveError) throw achieveError;
            }
          }
        }

        return true;
      } catch (error) {
        console.error('Error saving work experience:', error);
        throw error;
      }
    }
  },

  companies: {
    list: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    
    create: async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    update: async (id: string, company: Partial<Company>) => {
      const { data, error } = await supabase
        .from('companies')
        .update(company)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    delete: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  awards: {
    list: async (cvId: string) => {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('cv_id', cvId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    create: async (award: Omit<Award, 'id'>) => {
      try {
        const { data, error } = await supabase
          .from('awards')
          .insert(award)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating award:', error);
        throw error;
      }
    },
    
    update: async (id: string, award: Partial<Award>) => {
      try {
        const { data, error } = await supabase
          .from('awards')
          .update(award)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating award:', error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        const { error } = await supabase
          .from('awards')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting award:', error);
        throw error;
      }
    }
  },

  personalInfo: {
    get: async (cvId: string) => {
      // First, check if there are multiple records
      const { count, error: countError } = await supabase
        .from('personal_info')
        .select('*', { count: 'exact', head: true })
        .eq('cv_id', cvId);

      if (countError) throw countError;

      // If there are multiple records, we need to clean up
      if (count && count > 1) {
        // Get all records ordered by updated_at
        const { data: allRecords, error: fetchError } = await supabase
          .from('personal_info')
          .select('id, updated_at')
          .eq('cv_id', cvId)
          .order('updated_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Keep the most recent record and delete others
        if (allRecords && allRecords.length > 1) {
          const [latest, ...outdated] = allRecords;
          const outdatedIds = outdated.map(record => record.id);

          const { error: deleteError } = await supabase
            .from('personal_info')
            .delete()
            .in('id', outdatedIds);

          if (deleteError) throw deleteError;
        }
      }

      // Now fetch the single record
      const { data: personalInfo, error: personalInfoError } = await supabase
        .from('personal_info')
        .select(`
          id,
          cv_id,
          first_name,
          middle_name,
          last_name,
          email,
          phone,
          street,
          street_number,
          postal_code,
          city,
          state,
          country,
          website,
          linkedin,
          github,
          title,
          birthdate,
          nationality,
          relationship_status,
          profile_summaries (
            id,
            content
          )
        `)
        .eq('cv_id', cvId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (personalInfoError) throw personalInfoError;

      if (!personalInfo) return null;

      return {
        id: personalInfo.id,
        cvId: personalInfo.cv_id,
        firstName: personalInfo.first_name,
        middleName: personalInfo.middle_name || '',
        lastName: personalInfo.last_name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        street: personalInfo.street,
        streetNumber: personalInfo.street_number,
        postalCode: personalInfo.postal_code,
        city: personalInfo.city,
        state: personalInfo.state || '',
        country: personalInfo.country,
        website: personalInfo.website || '',
        linkedin: personalInfo.linkedin || '',
        github: personalInfo.github || '',
        title: personalInfo.title,
        birthdate: personalInfo.birthdate,
        nationality: personalInfo.nationality,
        relationshipStatus: personalInfo.relationship_status,
        profileSummaries: personalInfo.profile_summaries || []
      };
    },
    
    save: async (cvId: string, info: PersonalInfo) => {
      const { profileSummaries, ...personalInfo } = info;
      
      // Transform the data to match the database structure
      const dbPersonalInfo = {
        cv_id: cvId,
        first_name: personalInfo.firstName,
        middle_name: personalInfo.middleName,
        last_name: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        street: personalInfo.street,
        street_number: personalInfo.streetNumber,
        postal_code: personalInfo.postalCode,
        city: personalInfo.city,
        state: personalInfo.state,
        country: personalInfo.country,
        website: personalInfo.website,
        linkedin: personalInfo.linkedin,
        github: personalInfo.github,
        title: personalInfo.title,
        birthdate: personalInfo.birthdate,
        nationality: personalInfo.nationality,
        relationship_status: personalInfo.relationshipStatus
      };

      // Use upsert to create or update personal info
      const { data: savedInfo, error: personalInfoError } = await supabase
        .from('personal_info')
        .upsert(dbPersonalInfo, {
          onConflict: 'cv_id'
        })
        .select()
        .single();

      if (personalInfoError) throw personalInfoError;

      // Handle profile summaries
      if (profileSummaries && profileSummaries.length > 0) {
        // Delete existing summaries first
        const { error: deleteError } = await supabase
          .from('profile_summaries')
          .delete()
          .eq('personal_info_id', savedInfo.id);

        if (deleteError) throw deleteError;

        // Insert new summaries
        const summariesToSave = profileSummaries.map(summary => ({
          personal_info_id: savedInfo.id,
          content: summary.content
        }));

        const { error: summariesError } = await supabase
          .from('profile_summaries')
          .insert(summariesToSave);

        if (summariesError) throw summariesError;
      }

      // Fetch the complete saved data with profile summaries
      const { data: completeData, error: fetchError } = await supabase
        .from('personal_info')
        .select(`
          *,
          profile_summaries (
            id,
            content
          )
        `)
        .eq('id', savedInfo.id)
        .single();

      if (fetchError) throw fetchError;

      return completeData;
    }
  },

  languages: {
    list: async (cvId: string) => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('cv_id', cvId)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    
    save: async (cvId: string, languages: Language[]) => {
      try {
        // First, delete all existing languages for this CV
        const { error: deleteError } = await supabase
          .from('languages')
          .delete()
          .eq('cv_id', cvId);

        if (deleteError) throw deleteError;

        // Then insert new languages
        if (languages.length > 0) {
          const { data, error: insertError } = await supabase
            .from('languages')
            .insert(
              languages.map(lang => ({
                cv_id: cvId,
                name: lang.name,
                proficiency: lang.proficiency,
                certificate: lang.certificate || null,
                certificate_date: lang.certificateDate || null,
                certificate_url: lang.certificateUrl || null,
                notes: lang.notes || null
              }))
            )
            .select();

          if (insertError) throw insertError;
          return data;
        }

        return [];
      } catch (error) {
        console.error('Error saving languages:', error);
        throw error;
      }
    }
  },

  trainings: {
    list: async (cvId: string) => {
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('cv_id', cvId)
        .order('completion_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    save: async (cvId: string, trainings: Training[]) => {
      try {
        // First, delete all existing trainings for this CV
        const { error: deleteError } = await supabase
          .from('trainings')
          .delete()
          .eq('cv_id', cvId);

        if (deleteError) throw deleteError;

        // Then insert new trainings
        if (trainings.length > 0) {
          const { data, error: insertError } = await supabase
            .from('trainings')
            .insert(
              trainings.map(training => ({
                cv_id: cvId,
                title: training.title,
                provider: training.provider,
                completion_date: training.completionDate,
                description: training.description
              }))
            )
            .select();

          if (insertError) throw insertError;
          return data;
        }

        return [];
      } catch (error) {
        console.error('Error saving trainings:', error);
        throw error;
      }
    }
  },

  certifications: {
    list: async (cvId: string) => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('cv_id', cvId)
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    save: async (cvId: string, certifications: Certification[]) => {
      try {
        // First, delete all existing certifications for this CV
        const { error: deleteError } = await supabase
          .from('certifications')
          .delete()
          .eq('cv_id', cvId);

        if (deleteError) throw deleteError;

        // Then insert new certifications
        if (certifications.length > 0) {
          const { data, error: insertError } = await supabase
            .from('certifications')
            .insert(
              certifications.map(cert => ({
                cv_id: cvId,
                name: cert.name,
                issuing_organization: cert.issuingOrganization,
                issue_date: cert.issueDate,
                expiration_date: cert.expirationDate || null,
                credential_id: cert.credentialId || null,
                credential_url: cert.credentialURL || null
              }))
            )
            .select();

          if (insertError) throw insertError;
          return data;
        }

        return [];
      } catch (error) {
        console.error('Error saving certifications:', error);
        throw error;
      }
    }
  },

  testimonials: {
    save: async (cvId: string, testimonials: Testimonial[]) => {
      try {
        // First, delete all existing testimonials for this CV
        const { error: deleteError } = await supabase
          .from('testimonials')
          .delete()
          .eq('cv_id', cvId);

        if (deleteError) throw deleteError;

        // Then insert new testimonials
        if (testimonials.length > 0) {
          const { data, error: insertError } = await supabase
            .from('testimonials')
            .insert(
              testimonials.map(testimonial => ({
                cv_id: cvId,
                author: testimonial.author,
                role: testimonial.role,
                company: testimonial.company,
                relationship: testimonial.relationship,
                date: testimonial.date,
                content: testimonial.content,
                contact_info: testimonial.contactInfo || null,
                linkedin_profile: testimonial.linkedinProfile || null
              }))
            )
            .select();

          if (insertError) throw insertError;
          return data;
        }

        return [];
      } catch (error) {
        console.error('Error saving testimonials:', error);
        throw error;
      }
    }
  }
};