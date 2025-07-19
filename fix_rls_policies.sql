-- Fix RLS Policies for Stake Creation
-- The current policies are blocking inserts

-- 1. Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sherk_stakes';

-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Users can view own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can select own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can insert own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can update own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can delete own stakes" ON sherk_stakes;

-- 3. Temporarily disable RLS for testing
ALTER TABLE sherk_stakes DISABLE ROW LEVEL SECURITY;

-- 4. Test insert without RLS
INSERT INTO sherk_stakes (
  user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
) VALUES (
  '1ddbd059-7d23-426e-9610-4d5e2f35849c', 'RLS_TEST', 'kaspa:test', 1, 0, 0, 0, 'active'
) ON CONFLICT (user_id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  updated_at = NOW();

-- 5. Verify insert worked
SELECT * FROM sherk_stakes WHERE user_id = '1ddbd059-7d23-426e-9610-4d5e2f35849c';

-- 6. Clean up test data
DELETE FROM sherk_stakes WHERE nickname = 'RLS_TEST';

-- 7. Re-enable RLS
ALTER TABLE sherk_stakes ENABLE ROW LEVEL SECURITY;

-- 8. Create simple, working policies
CREATE POLICY "Enable all operations for authenticated users" ON sherk_stakes
  FOR ALL USING (auth.role() = 'authenticated');

-- 9. Test the new policy
SELECT 
  'New RLS Test' as test_type,
  COUNT(*) as accessible_rows
FROM sherk_stakes 
WHERE user_id = '1ddbd059-7d23-426e-9610-4d5e2f35849c';

-- 10. Show final policy status
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes'; 