-- Manual Stake Insert Script for Supabase
-- Run this in your Supabase SQL Editor if the form fails

-- First, delete any existing stake for this user (optional)
DELETE FROM sherk_stakes WHERE user_id = '1ddbd059-7d23-426e-9610-4d5e2f35849c';

-- Insert the new stake
INSERT INTO sherk_stakes (
  user_id,
  nickname,
  wallet_address,
  common_nfts,
  rare_nfts,
  ultra_rare_nfts,
  boom_nfts,
  status,
  created_at,
  updated_at
) VALUES (
  '1ddbd059-7d23-426e-9610-4d5e2f35849c',
  '3454',
  'RE3',
  0,
  4,
  0,
  0,
  'active',
  NOW(),
  NOW()
);

-- Verify the insertion
SELECT * FROM sherk_stakes WHERE user_id = '1ddbd059-7d23-426e-9610-4d5e2f35849c'; 