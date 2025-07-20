-- Check Stake Data for Specific User
-- Replace '0d4c17e3-d619-4acc-b85f-7313dead2909' with the actual user ID from the logs

-- 1. Check if the user exists in auth.users
SELECT 
  'Auth User Check' as check_type,
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE id = '0d4c17e3-d619-4acc-b85f-7313dead2909';

-- 2. Check if the user has a record in the users table
SELECT 
  'User Record Check' as check_type,
  id,
  email,
  role,
  created_at
FROM users 
WHERE id = '0d4c17e3-d619-4acc-b85f-7313dead2909';

-- 3. Check if the user has any stakes
SELECT 
  'Stake Check' as check_type,
  COUNT(*) as total_stakes
FROM sherk_stakes 
WHERE user_id = '0d4c17e3-d619-4acc-b85f-7313dead2909';

-- 4. Show all stakes for this user
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
WHERE user_id = '0d4c17e3-d619-4acc-b85f-7313dead2909';

-- 5. Check RLS status
SELECT 
  'RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sherk_stakes';

-- 6. Check all policies
SELECT 
  'Policies' as check_type,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes';

-- 7. Test direct query without RLS
-- This will show what data exists regardless of policies
SELECT 
  'Direct Query Test' as check_type,
  COUNT(*) as total_stakes_in_table
FROM sherk_stakes;

-- 8. Show all stakes in the table (for debugging)
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
  created_at
FROM sherk_stakes
ORDER BY created_at DESC
LIMIT 10; 