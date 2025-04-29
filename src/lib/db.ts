import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
}

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error('You are currently offline. Please check your internet connection and try again.');
    }

    if (retries > 0 && error instanceof Error && error.message.includes('Failed to fetch')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2);
    }

    throw error;
  }
}

// Create client with additional options for better reliability
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'cv-builder'
    }
  },
  db: {
    schema: 'public'
  }
});

// Test connection with retry mechanism
retryOperation(async () => {
  const { count } = await supabase
    .from('users')
    .select('count', { count: 'exact', head: true });
  console.log('Supabase connection established');
})
.catch(error => console.error('Supabase connection error:', error.message));

// Export the retry operation utility for use in other modules
export { retryOperation };