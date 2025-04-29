import { supabase } from '../db';

interface PersonalityTest {
  id: string;
  type: string;
  completionDate: string;
  provider?: string;
  description?: string;
  reportUrl?: string;
  trait?: string;
  score?: string;
}

export const personalityApi = {
  async list(cvId: string): Promise<PersonalityTest[]> {
    const { data, error } = await supabase
      .from('personality_tests')
      .select('*')
      .eq('cv_id', cvId)
      .order('completion_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(test => ({
      id: test.id,
      type: test.type,
      completionDate: test.completion_date,
      provider: test.provider,
      description: test.description,
      reportUrl: test.report_url,
      trait: test.trait,
      score: test.score
    }));
  },

  async save(cvId: string, tests: PersonalityTest[]): Promise<PersonalityTest[]> {
    // First delete existing tests
    const { error: deleteError } = await supabase
      .from('personality_tests')
      .delete()
      .eq('cv_id', cvId);

    if (deleteError) throw deleteError;

    if (tests.length === 0) return [];

    // Insert new tests
    const { data, error: insertError } = await supabase
      .from('personality_tests')
      .insert(
        tests.map(test => ({
          cv_id: cvId,
          type: test.type,
          completion_date: test.completionDate,
          provider: test.provider,
          description: test.description,
          report_url: test.reportUrl,
          trait: test.trait,
          score: test.score
        }))
      )
      .select();

    if (insertError) throw insertError;
    if (!data) throw new Error('Failed to save personality tests');

    return data.map(test => ({
      id: test.id,
      type: test.type,
      completionDate: test.completion_date,
      provider: test.provider,
      description: test.description,
      reportUrl: test.report_url,
      trait: test.trait,
      score: test.score
    }));
  }
};