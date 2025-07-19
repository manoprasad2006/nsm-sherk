import { createClient } from '@supabase/supabase-js'

// These will be set via environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

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