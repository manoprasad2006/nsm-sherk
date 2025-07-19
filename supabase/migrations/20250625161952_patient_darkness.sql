/*
  # Create initial admin user

  This migration creates a function to promote a user to admin status.
  After running this migration, you can call the function with a user's email
  to make them an admin.

  Usage:
  SELECT promote_user_to_admin('admin@example.com');
*/

-- Function to promote a user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS boolean AS $$
DECLARE
  user_found boolean := false;
BEGIN
  UPDATE users 
  SET role = 'admin', updated_at = now()
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_found = FOUND;
  
  IF user_found THEN
    RAISE NOTICE 'User % has been promoted to admin', user_email;
    RETURN true;
  ELSE
    RAISE NOTICE 'User with email % not found', user_email;
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admins can promote others)
GRANT EXECUTE ON FUNCTION promote_user_to_admin(text) TO authenticated;