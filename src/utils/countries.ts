import { supabase } from '../lib/db';

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

export async function getCountries() {
  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');

    if (error) throw error;
    if (!data) return [];

    return data;
  });
}