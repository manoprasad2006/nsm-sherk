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

export type SherkStake = {
  id?: string
  user_id: string
  wallet_address: string
  nickname: string
  common_nfts: number
  rare_nfts: number
  ultra_rare_nfts: number
  boom_nfts: number
  total_pickaxes: number
  weekly_reward: number
  status: 'active' | 'inactive' | 'pending'
  last_reward_date?: string
  total_rewards_earned: number
  created_at?: string
  updated_at?: string
}

export type SherkReward = {
  id?: string
  user_id: string
  stake_id: string
  week_number: number
  reward_amount: number
  pickaxes_count: number
  payout_status: 'pending' | 'paid' | 'failed'
  payout_date?: string
  created_at?: string
}