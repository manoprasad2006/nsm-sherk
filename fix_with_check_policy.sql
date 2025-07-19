-- Fix RLS Policy WITH CHECK Issue
-- The current policy has NULL with_check which can cause insert problems

-- 1. Drop the current policy
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON sherk_stakes;

-- 2. Create separate policies with explicit WITH CHECK clauses
CREATE POLICY "Users can view own stakes" ON sherk_stakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes" ON sherk_stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stakes" ON sherk_stakes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stakes" ON sherk_stakes
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Test the policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes'
ORDER BY cmd;

-- 4. Test insert with proper authentication context
-- This simulates what happens when a user submits the form
DO $$
DECLARE
  test_user_id UUID := '1ddbd059-7d23-426e-9610-4d5e2f35849c';
  insert_result RECORD;
BEGIN
  -- Set the auth context (simulate user login)
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
  
  -- Try to insert test data
  INSERT INTO sherk_stakes (
    user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
  ) VALUES (
    test_user_id, 'POLICY_TEST', 'kaspa:test', 1, 0, 0, 0, 'active'
  ) ON CONFLICT (user_id) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    updated_at = NOW()
  RETURNING * INTO insert_result;
  
  RAISE NOTICE 'Insert successful with proper policy: %', insert_result;
  
  -- Clean up
  DELETE FROM sherk_stakes WHERE nickname = 'POLICY_TEST';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Insert failed: %', SQLERRM;
END $$;

-- 5. Verify the fix works
SELECT 
  'Policy Test' as test_type,
  COUNT(*) as accessible_rows
FROM sherk_stakes 
WHERE user_id = '1ddbd059-7d23-426e-9610-4d5e2f35849c'; 