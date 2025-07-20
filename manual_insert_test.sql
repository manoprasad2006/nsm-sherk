-- Manual Insert Test for User
-- This will help us determine if the issue is with the form or database constraints

-- 1. First, let's try to insert a test stake manually
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
  '0d4c17e3-d619-4acc-b85f-7313dead2909',
  'MANUAL_TEST',
  'kaspa:manual-test',
  1,
  0,
  0,
  0,
  'active',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  wallet_address = EXCLUDED.wallet_address,
  common_nfts = EXCLUDED.common_nfts,
  rare_nfts = EXCLUDED.rare_nfts,
  ultra_rare_nfts = EXCLUDED.ultra_rare_nfts,
  boom_nfts = EXCLUDED.boom_nfts,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 2. Verify the insert worked
SELECT 
  'Manual Insert Test' as test_type,
  COUNT(*) as stakes_after_insert
FROM sherk_stakes 
WHERE user_id = '0d4c17e3-d619-4acc-b85f-7313dead2909';

-- 3. Show the inserted data
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

-- 4. Test the exact query that the dashboard uses
SELECT 
  'Dashboard Query Test' as test_type,
  COUNT(*) as accessible_stakes
FROM sherk_stakes 
WHERE user_id = '0d4c17e3-d619-4acc-b85f-7313dead2909';

-- 5. Clean up the test data (optional)
-- DELETE FROM sherk_stakes WHERE nickname = 'MANUAL_TEST'; 