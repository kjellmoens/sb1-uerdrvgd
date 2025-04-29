import { supabase } from '../db';
import type { PersonalInfo } from '../../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error('You are currently offline. Please check your internet connection and try again.');
    }

    if (retries > 0 && error instanceof Error && error.message.includes('Failed to fetch')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }

    throw error;
  }
}

export const personalInfoApi = {
  async get(cvId: string): Promise<PersonalInfo | null> {
    return retryOperation(async () => {
      const { data: personalInfo, error: personalInfoError } = await supabase
        .from('personal_info')
        .select(`
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
          website,
          linkedin,
          github,
          title,
          birthdate,
          relationship_status,
          country_code,
          nationality_code,
          countries!personal_info_nationality_code_fkey (
            nationality
          ),
          profile_summaries (
            id,
            content
          )
        `)
        .eq('cv_id', cvId)
        .limit(1)
        .single();

      if (personalInfoError) {
        // If no data found, return null instead of throwing an error
        if (personalInfoError.code === 'PGRST116') {
          return null;
        }
        throw personalInfoError;
      }

      if (!personalInfo) return null;

      return {
        id: personalInfo.id,
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
        website: personalInfo.website || '',
        linkedin: personalInfo.linkedin || '',
        github: personalInfo.github || '',
        title: personalInfo.title,
        birthdate: personalInfo.birthdate,
        relationshipStatus: personalInfo.relationship_status,
        countryCode: personalInfo.country_code,
        nationalityCode: personalInfo.nationality_code,
        profileSummaries: personalInfo.profile_summaries || []
      };
    });
  },

  async save(cvId: string, info: PersonalInfo): Promise<PersonalInfo> {
    return retryOperation(async () => {
      // First save personal info
      const { data: savedInfo, error: infoError } = await supabase
        .from('personal_info')
        .upsert({
          cv_id: cvId,
          first_name: info.firstName,
          middle_name: info.middleName,
          last_name: info.lastName,
          email: info.email,
          phone: info.phone,
          street: info.street,
          street_number: info.streetNumber,
          postal_code: info.postalCode,
          city: info.city,
          state: info.state,
          website: info.website,
          linkedin: info.linkedin,
          github: info.github,
          title: info.title,
          birthdate: info.birthdate,
          relationship_status: info.relationshipStatus,
          country_code: info.countryCode,
          nationality_code: info.nationalityCode
        })
        .select()
        .single();

      if (infoError) throw infoError;
      if (!savedInfo) throw new Error('Failed to save personal info');

      // Then save profile summaries
      if (info.profileSummaries && info.profileSummaries.length > 0) {
        const { error: summariesError } = await supabase
          .from('profile_summaries')
          .upsert(
            info.profileSummaries.map(summary => ({
              id: summary.id.startsWith('new-') ? undefined : summary.id,
              personal_info_id: savedInfo.id,
              content: summary.content
            }))
          );

        if (summariesError) throw summariesError;
      }

      return info;
    });
  }
};