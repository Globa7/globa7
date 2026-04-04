import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client to avoid multiple instances
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseInstance) {
    if (!projectId || !publicAnonKey) {
      console.warn('Supabase credentials missing - running in demo mode with default data');
      return null;
    }
    
    try {
      supabaseInstance = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      return null;
    }
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();