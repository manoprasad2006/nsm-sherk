import { createClient } from '@supabase/supabase-js'

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch {
  throw new Error(
    'Invalid VITE_SUPABASE_URL format. Please ensure it follows the pattern: https://your-project.supabase.co'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  telegram?: string
  role: 'user' | 'admin'
}

export type MiningRig = {
  id?: string
  user_id: string
  wallet_address: string
  rig_name: string
  rare_nfts: number
  common_nfts: number
  telegram_id: string
  created_at?: string
}