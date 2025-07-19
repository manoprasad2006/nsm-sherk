/*
  # Update mining_rigs table for SHERK token staking system

  This migration updates the existing mining_rigs table to support the SHERK token
  staking system with the new NFT types and pickaxe mechanics.

  Changes:
  1. Rename table to `sherk_stakes` for clarity
  2. Update NFT types to match SHERK collection:
     - Common (1110 total) - 1 pickaxe
     - Rare (555 total) - 2 pickaxes  
     - Ultra Rare (333 total) - 3 pickaxes
     - BOOM (54 total) - 4 pickaxes
  3. Add new fields for SHERK-specific functionality
  4. Update total_slots calculation to use pickaxes
*/

-- Create new sherk_stakes table
CREATE TABLE IF NOT EXISTS sherk_stakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  nickname text NOT NULL,
  common_nfts integer DEFAULT 0 CHECK (common_nfts >= 0),
  rare_nfts integer DEFAULT 0 CHECK (rare_nfts >= 0),
  ultra_rare_nfts integer DEFAULT 0 CHECK (ultra_rare_nfts >= 0),
  boom_nfts integer DEFAULT 0 CHECK (boom_nfts >= 0),
  total_pickaxes integer GENERATED ALWAYS AS (
    common_nfts * 1 + 
    rare_nfts * 2 + 
    ultra_rare_nfts * 3 + 
    boom_nfts * 4
  ) STORED,
  weekly_reward numeric GENERATED ALWAYS AS (
    (common_nfts * 1 + rare_nfts * 2 + ultra_rare_nfts * 3 + boom_nfts * 4) * 1562
  ) STORED,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_reward_date timestamptz,
  total_rewards_earned numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure at least one NFT is staked
  CONSTRAINT at_least_one_nft CHECK (common_nfts > 0 OR rare_nfts > 0 OR ultra_rare_nfts > 0 OR boom_nfts > 0),
  -- Ensure user can only have one active stake
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE sherk_stakes ENABLE ROW LEVEL SECURITY;

-- Users can read their own stakes
CREATE POLICY "Users can read own sherk stakes"
  ON sherk_stakes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own stakes
CREATE POLICY "Users can create own sherk stakes"
  ON sherk_stakes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own stakes
CREATE POLICY "Users can update own sherk stakes"
  ON sherk_stakes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stakes
CREATE POLICY "Users can delete own sherk stakes"
  ON sherk_stakes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all stakes
CREATE POLICY "Admins can read all sherk stakes"
  ON sherk_stakes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage all stakes
CREATE POLICY "Admins can manage all sherk stakes"
  ON sherk_stakes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_user_id ON sherk_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_status ON sherk_stakes(status);
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_created_at ON sherk_stakes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_wallet_address ON sherk_stakes(wallet_address);

-- Trigger to update updated_at on sherk_stakes table
CREATE TRIGGER update_sherk_stakes_updated_at
  BEFORE UPDATE ON sherk_stakes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create rewards table for tracking weekly payouts
CREATE TABLE IF NOT EXISTS sherk_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stake_id uuid NOT NULL REFERENCES sherk_stakes(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  reward_amount numeric NOT NULL,
  pickaxes_count integer NOT NULL,
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'failed')),
  payout_date timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique reward per user per week
  UNIQUE(user_id, week_number)
);

-- Enable RLS on rewards table
ALTER TABLE sherk_rewards ENABLE ROW LEVEL SECURITY;

-- Users can read their own rewards
CREATE POLICY "Users can read own sherk rewards"
  ON sherk_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all rewards
CREATE POLICY "Admins can manage all sherk rewards"
  ON sherk_rewards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for rewards table
CREATE INDEX IF NOT EXISTS idx_sherk_rewards_user_id ON sherk_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_sherk_rewards_week_number ON sherk_rewards(week_number);
CREATE INDEX IF NOT EXISTS idx_sherk_rewards_payout_status ON sherk_rewards(payout_status);

-- Create function to calculate weekly rewards for all active stakes
CREATE OR REPLACE FUNCTION calculate_weekly_rewards(week_num integer)
RETURNS void AS $$
BEGIN
  INSERT INTO sherk_rewards (user_id, stake_id, week_number, reward_amount, pickaxes_count)
  SELECT 
    ss.user_id,
    ss.id,
    week_num,
    ss.weekly_reward,
    ss.total_pickaxes
  FROM sherk_stakes ss
  WHERE ss.status = 'active'
  ON CONFLICT (user_id, week_number) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION calculate_weekly_rewards(integer) TO authenticated;

-- Create function to mark rewards as paid
CREATE OR REPLACE FUNCTION mark_rewards_paid(week_num integer)
RETURNS void AS $$
BEGIN
  UPDATE sherk_rewards 
  SET payout_status = 'paid', payout_date = now()
  WHERE week_number = week_num AND payout_status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_rewards_paid(integer) TO authenticated; 