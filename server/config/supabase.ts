import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client with custom configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Admin client for server-side operations (uses service role key)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY not found. Please set it in your .env file');
}
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  FILES: 'files',
  AVATARS: 'avatars',
  TEMP: 'temp'
} as const;

// Realtime channel names
export const REALTIME_CHANNELS = {
  FILE_UPDATES: 'file-updates',
  SHARE_UPDATES: 'share-updates',
  AUDIT_LOGS: 'audit-logs',
  SYSTEM_ALERTS: 'system-alerts'
} as const;
