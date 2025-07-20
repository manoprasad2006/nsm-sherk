-- Enable Secure RLS Policies
-- This will provide proper security while ensuring all users can access their own data

-- 1. First, let's check the current status
SELECT 
  'Current Status' as check_type,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sherk_stakes';

-- 2. Enable RLS
ALTER TABLE sherk_stakes ENABLE ROW LEVEL SECURITY;

-- 3. Create a simple, secure policy that works for all users
-- This policy allows users to do everything with their own stakes
CREATE POLICY "Users can manage their own stakes" ON sherk_stakes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Create a policy for admins to read all stakes (optional)
-- Uncomment if you want admins to see all stakes
-- CREATE POLICY "Admins can read all stakes" ON sherk_stakes
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- 5. Grant necessary permissions
GRANT ALL ON sherk_stakes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. Test the policy with a sample user
-- Replace with an actual user ID from your auth.users table
DO $$
DECLARE
  test_user_id UUID := '0d4c17e3-d619-4acc-b85f-7313dead2909';
  stake_count INTEGER;
BEGIN
  -- Test SELECT
  SELECT COUNT(*) INTO stake_count
  FROM sherk_stakes 
  WHERE user_id = test_user_id;
  
  RAISE NOTICE 'Test user has % stakes', stake_count;
  
  -- Test INSERT
  INSERT INTO sherk_stakes (
    user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
  ) VALUES (
    test_user_id, 'RLS_TEST', 'kaspa:test', 1, 0, 0, 0, 'active'
  ) ON CONFLICT (user_id) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    updated_at = NOW();
    
  RAISE NOTICE 'Test insert/update successful';
  
  -- Clean up
  DELETE FROM sherk_stakes WHERE nickname = 'RLS_TEST';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Test failed: %', SQLERRM;
END $$;

-- 7. Show the final policy status
SELECT 
  'Final Policy Status' as check_type,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes';

-- 8. Verify RLS is enabled
SELECT 
  'Final RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sherk_stakes';

-- 9. Test that existing data is still accessible
SELECT 
  'Data Accessibility Test' as check_type,
  COUNT(*) as total_stakes
FROM sherk_stakes; 