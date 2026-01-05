
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // It's okay to log a warning, but we might want to handle this more gracefully in UI
  console.warn('Supabase URL or Key not found in environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
