import { supabase } from '../../../lib/db';

export async function loadTestimonials(cvId: string) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('cv_id', cvId);

  if (error) throw error;
  return data;
}