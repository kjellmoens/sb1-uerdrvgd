import { supabase } from '../../../lib/db';

export async function loadAwards(cvId: string) {
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}