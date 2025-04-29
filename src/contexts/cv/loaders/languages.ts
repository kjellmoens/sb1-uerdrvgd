import { supabase } from '../../../lib/db';

export async function loadLanguages(cvId: string) {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}