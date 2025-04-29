import { supabase } from '../db';
import { Skill } from '../../types';

export const skillsApi = {
  async list() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('domain', { ascending: true });

    if (error) throw error;
    return data as Skill[];
  },

  async create(skill: Omit<Skill, 'id'>) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();

    if (error) throw error;
    return data as Skill;
  },

  async update(id: string, skill: Partial<Omit<Skill, 'id'>>) {
    const { data, error } = await supabase
      .from('skills')
      .update(skill)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Skill;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};