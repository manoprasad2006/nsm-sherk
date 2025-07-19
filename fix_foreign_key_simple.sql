-- Simple Fix: Change Foreign Key to Reference auth.users Directly
-- This avoids the need for a separate users table

-- 1. Drop the existing foreign key constraint
ALTER TABLE sherk_stakes DROP CONSTRAINT IF EXISTS sherk_stakes_user_id_fkey;

-- 2. Add new foreign key constraint that references auth.users directly
ALTER TABLE sherk_stakes ADD CONSTRAINT sherk_stakes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Verify the constraint is working
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'sherk_stakes'::regclass 
AND conname = 'sherk_stakes_user_id_fkey';

-- 4. Test insert with a valid user_id
-- Replace 'test-user-id' with an actual user_id from auth.users
SELECT 
  'Test User Check' as check_type,
  COUNT(*) as valid_users
FROM auth.users 
WHERE id = 'c5c2557e-12e5-4467-9adf-caf94be2ad6b';

-- 5. Show all auth users for reference
SELECT 
  id,
  email,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10; 