-- Fix RLS Policy Issue Causing 401 Errors
-- The current policy is blocking POST requests

-- 1. Check current RLS status
SELECT 
  'Current RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sherk_stakes';

-- 2. Check current policies
SELECT 
  'Current Policies' as check_type,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes';

-- 3. Drop the problematic policy
DROP POLICY IF EXISTS "Users can manage their own stakes" ON sherk_stakes;

-- 4. Create separate policies for each operation
-- SELECT policy
CREATE POLICY "Users can view own stakes" ON sherk_stakes
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert own stakes" ON sherk_stakes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update own stakes" ON sherk_stakes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete own stakes" ON sherk_stakes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Grant permissions
GRANT ALL ON sherk_stakes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. Test the policies
DO $$
DECLARE
  test_user_id UUID := '046d138e-fe44-4752-9ed2-d8ff7c36f3aa'; -- Use the user ID from your error
BEGIN
  -- Test SELECT
  RAISE NOTICE 'Testing SELECT policy...';
  PERFORM COUNT(*) FROM sherk_stakes WHERE user_id = test_user_id;
  RAISE NOTICE 'SELECT policy works';
  
  -- Test INSERT (this should work now)
  RAISE NOTICE 'Testing INSERT policy...';
  INSERT INTO sherk_stakes (
    user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
  ) VALUES (
    test_user_id, 'RLS_FIX_TEST', 'kaspa:test', 1, 0, 0, 0, 'active'
  ) ON CONFLICT (user_id) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    updated_at = NOW();
  RAISE NOTICE 'INSERT policy works';
  
  -- Clean up
  DELETE FROM sherk_stakes WHERE nickname = 'RLS_FIX_TEST';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Test failed: %', SQLERRM;
END $$;

-- 7. Show final policy status
SELECT 
  'Final Policy Status' as check_type,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes'
ORDER BY cmd;

-- 8. Verify RLS is enabled
SELECT 
  'Final RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sherk_stakes'; 