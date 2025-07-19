/*
  # Create mining_rigs table for NFT staking

  1. New Tables
    - `mining_rigs`
      - `id` (uuid, primary key) - unique identifier
      - `user_id` (uuid, foreign key) - references users.id
      - `wallet_address` (text) - Kaspa wallet address
      - `rig_name` (text) - user-defined name for their rig
      - `rare_nfts` (integer) - number of rare NFTs (2 slots each)
      - `common_nfts` (integer) - number of common NFTs (0.5 slots each)
      - `telegram_id` (text) - telegram username for notifications
      - `status` (text) - active/inactive/pending
      - `total_slots` (numeric) - calculated total staking slots
      - `created_at` (timestamp) - when the rig was created
      - `updated_at` (timestamp) - last update time

  2. Security
    - Enable RLS on `mining_rigs` table
    - Add policy for users to manage their own rigs
    - Add policy for admins to read all rigs
    - Add policy for admins to manage all rigs

  3. Indexes
    - Index on user_id for faster queries
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS mining_rigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  rig_name text NOT NULL,
  rare_nfts integer DEFAULT 0 CHECK (rare_nfts >= 0),
  common_nfts integer DEFAULT 0 CHECK (common_nfts >= 0),
  telegram_id text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  total_slots numeric GENERATED ALWAYS AS (rare_nfts * 2 + common_nfts * 0.5) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure at least one NFT is staked
  CONSTRAINT at_least_one_nft CHECK (rare_nfts > 0 OR common_nfts > 0),
  -- Ensure user can only have one active rig
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE mining_rigs ENABLE ROW LEVEL SECURITY;

-- Users can read their own mining rigs
CREATE POLICY "Users can read own mining rigs"
  ON mining_rigs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own mining rigs
CREATE POLICY "Users can create own mining rigs"
  ON mining_rigs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own mining rigs
CREATE POLICY "Users can update own mining rigs"
  ON mining_rigs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own mining rigs
CREATE POLICY "Users can delete own mining rigs"
  ON mining_rigs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all mining rigs
CREATE POLICY "Admins can read all mining rigs"
  ON mining_rigs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage all mining rigs
CREATE POLICY "Admins can manage all mining rigs"
  ON mining_rigs
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
CREATE INDEX IF NOT EXISTS idx_mining_rigs_user_id ON mining_rigs(user_id);
CREATE INDEX IF NOT EXISTS idx_mining_rigs_status ON mining_rigs(status);
CREATE INDEX IF NOT EXISTS idx_mining_rigs_created_at ON mining_rigs(created_at DESC);

-- Trigger to update updated_at on mining_rigs table
CREATE TRIGGER update_mining_rigs_updated_at
  BEFORE UPDATE ON mining_rigs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();