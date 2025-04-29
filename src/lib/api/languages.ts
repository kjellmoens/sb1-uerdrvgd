import { Language } from '../../types';
import { supabase } from '../db';

export const languagesApi = {
  async list(cvId: string): Promise<Language[]> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('cv_id', cvId)
      .order('id');

    if (error) {
      throw new Error(`Error fetching languages: ${error.message}`);
    }

    return data || [];
  },

  async save(cvId: string, languages: Language[]): Promise<Language[]> {
    // First, delete all existing languages for this CV
    const { error: deleteError } = await supabase
      .from('languages')
      .delete()
      .eq('cv_id', cvId);

    if (deleteError) {
      throw new Error(`Error deleting existing languages: ${deleteError.message}`);
    }

    // Then insert the new languages
    const { data, error: insertError } = await supabase
      .from('languages')
      .insert(
        languages.map(language => ({
          ...language,
          cv_id: cvId
        }))
      )
      .select();

    if (insertError) {
      throw new Error(`Error saving languages: ${insertError.message}`);
    }

    return data || [];
  }
};