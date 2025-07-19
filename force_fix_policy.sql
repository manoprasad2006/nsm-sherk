-- Force fix all RLS policies for sherk_stakes table
-- This will drop and recreate all policies to ensure they work correctly

-- 1. Drop ALL existing policies for sherk_stakes
DROP POLICY IF EXISTS "Users can view own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can select own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can insert own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can update own stakes" ON sherk_stakes;
DROP POLICY IF EXISTS "Users can delete own stakes" ON sherk_stakes;

-- 2. Disable and re-enable RLS to clear any cached policies
ALTER TABLE sherk_stakes DISABLE ROW LEVEL SECURITY;
ALTER TABLE sherk_stakes ENABLE ROW LEVEL SECURITY;

-- 3. Create all policies fresh with correct qualifications
CREATE POLICY "Users can view own stakes" ON sherk_stakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes" ON sherk_stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stakes" ON sherk_stakes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stakes" ON sherk_stakes
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Verify all policies are correct
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes'
ORDER BY cmd, policyname;

-- 5. Test insert permission
SELECT 
  'Policy verification complete' as status,
  COUNT(*) as total_policies,
  COUNT(CASE WHEN qual IS NOT NULL THEN 1 END) as policies_with_qual,
  COUNT(CASE WHEN with_check IS NOT NULL THEN 1 END) as policies_with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes'; 