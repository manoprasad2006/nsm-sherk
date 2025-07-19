-- Supabase Setup Script for SHERK Staking
-- Run this in your Supabase SQL Editor

-- 1. Create the sherk_stakes table if it doesn't exist
CREATE TABLE IF NOT EXISTS sherk_stakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  common_nfts INTEGER DEFAULT 0,
  rare_nfts INTEGER DEFAULT 0,
  ultra_rare_nfts INTEGER DEFAULT 0,
  boom_nfts INTEGER DEFAULT 0,
  total_pickaxes INTEGER GENERATED ALWAYS AS (
    common_nfts * 1 + 
    rare_nfts * 2 + 
    ultra_rare_nfts * 3 + 
    boom_nfts * 4
  ) STORED,
  weekly_reward INTEGER GENERATED ALWAYS AS (
    common_nfts * 1562 + 
    rare_nfts * 3124 + 
    ultra_rare_nfts * 4686 + 
    boom_nfts * 6248
  ) STORED,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Enable Row Level Security
ALTER TABLE sherk_stakes ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
-- Policy for users to view their own stakes
CREATE POLICY "Users can view own stakes" ON sherk_stakes
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own stakes
CREATE POLICY "Users can insert own stakes" ON sherk_stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own stakes
CREATE POLICY "Users can update own stakes" ON sherk_stakes
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own stakes
CREATE POLICY "Users can delete own stakes" ON sherk_stakes
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_sherk_stakes_updated_at ON sherk_stakes;
CREATE TRIGGER update_sherk_stakes_updated_at
  BEFORE UPDATE ON sherk_stakes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Grant necessary permissions
GRANT ALL ON sherk_stakes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Test the setup
-- This will show you if everything is working
SELECT 
  'Table created successfully' as status,
  COUNT(*) as existing_stakes
FROM sherk_stakes; 