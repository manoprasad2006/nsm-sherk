-- Fix the INSERT policy for sherk_stakes table
-- The current INSERT policy has NULL qualification, which is causing issues

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own stakes" ON sherk_stakes;

-- Create the correct INSERT policy with proper qualification
CREATE POLICY "Users can insert own stakes" ON sherk_stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verify the fix
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'sherk_stakes' 
AND cmd = 'INSERT'; 