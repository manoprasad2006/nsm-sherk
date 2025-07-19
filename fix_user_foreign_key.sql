-- Fix Foreign Key Constraint Issue
-- The sherk_stakes table references users(id) but user records don't exist

-- 1. Check if the users table exists and has the trigger
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 2. Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 3. Create the trigger if it doesn't exist
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 5. Manually insert missing user records for existing auth users
INSERT INTO users (id, email)
SELECT 
  au.id,
  au.email
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL;

-- 6. Verify all auth users have corresponding user records
SELECT 
  'User Records Check' as check_type,
  COUNT(*) as auth_users,
  (SELECT COUNT(*) FROM users) as user_records,
  COUNT(*) - (SELECT COUNT(*) FROM users) as missing_records
FROM auth.users;

-- 7. Test the foreign key constraint
SELECT 
  'Foreign Key Test' as test_type,
  COUNT(*) as valid_references
FROM sherk_stakes ss
JOIN users u ON ss.user_id = u.id;

-- 8. Show any invalid references
SELECT 
  ss.user_id,
  ss.nickname,
  'Missing user record' as issue
FROM sherk_stakes ss
LEFT JOIN users u ON ss.user_id = u.id
WHERE u.id IS NULL; 