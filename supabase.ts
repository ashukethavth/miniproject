import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our auth system
export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  mfa_enabled: boolean
  phone?: string
  avatar_url?: string
  full_name?: string
  username?: string
  // Computed properties for convenienceclear
  
  mfaEnabled?: boolean
  mfaType?: 'sms' | 'totp' | null
  phoneNumber?: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: User
}

export interface MFASettings {
  totp_enabled: boolean
  sms_enabled: boolean
  backup_codes: string[]
  phone_number?: string
}