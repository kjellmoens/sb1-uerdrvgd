import { supabase } from '../../../lib/db';

export async function loadPersonality(cvId: string) {
  const { data, error } = await supabase
    .from('personality_tests')
    .select('*')
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}