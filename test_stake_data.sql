-- Test script to check stake data in database
-- Run this in your Supabase SQL Editor

-- 1. Check if the sherk_stakes table exists and has data
SELECT 
  'Table Check' as check_type,
  COUNT(*) as total_stakes
FROM sherk_stakes;

-- 2. Show all stakes in the database
SELECT 
  id,
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
FROM sherk_stakes
ORDER BY created_at DESC;

-- 3. Check for specific user (replace with your user ID)
-- Replace '1004ecc3-68fb-4bf4-b16a-83308df3f825' with your actual user ID
SELECT 
  'User Stake Check' as check_type,
  COUNT(*) as user_stakes
FROM sherk_stakes 
WHERE user_id = '1004ecc3-68fb-4bf4-b16a-83308df3f825';

-- 4. Show the specific user's stake
SELECT 
  id,
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
FROM sherk_stakes 
WHERE user_id = '1004ecc3-68fb-4bf4-b16a-83308df3f825';

-- 5. Check auth.users table for the user
SELECT 
  'Auth User Check' as check_type,
  COUNT(*) as auth_users
FROM auth.users 
WHERE id = '1004ecc3-68fb-4bf4-b16a-83308df3f825';

-- 6. Show auth user details
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE id = '1004ecc3-68fb-4bf4-b16a-83308df3f825'; 