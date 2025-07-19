-- Comprehensive Debug Script for Stake Form Issues
-- Run this in your Supabase SQL Editor to diagnose all problems

-- 1. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'sherk_stakes'
ORDER BY ordinal_position;

-- 2. Check all constraints
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'sherk_stakes'::regclass;

-- 3. Check RLS policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'sherk_stakes';

-- 4. Check table permissions
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'sherk_stakes';

-- 5. Test insert with sample data
DO $$
DECLARE
  test_user_id UUID := '1ddbd059-7d23-426e-9610-4d5e2f35849c';
  insert_result RECORD;
BEGIN
  -- Try to insert test data
  INSERT INTO sherk_stakes (
    user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
  ) VALUES (
    test_user_id, 'DEBUG_TEST', 'kaspa:debug', 1, 0, 0, 0, 'active'
  ) ON CONFLICT (user_id) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    wallet_address = EXCLUDED.wallet_address,
    common_nfts = EXCLUDED.common_nfts,
    rare_nfts = EXCLUDED.rare_nfts,
    ultra_rare_nfts = EXCLUDED.ultra_rare_nfts,
    boom_nfts = EXCLUDED.boom_nfts,
    status = EXCLUDED.status,
    updated_at = NOW()
  RETURNING * INTO insert_result;
  
  RAISE NOTICE 'Insert successful: %', insert_result;
  
  -- Clean up
  DELETE FROM sherk_stakes WHERE nickname = 'DEBUG_TEST';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Insert failed: %', SQLERRM;
END $$;

-- 6. Check for any locks or blocking
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  left(query, 100) as query_preview
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT LIKE '%pg_stat_activity%'
AND query LIKE '%sherk_stakes%';

-- 7. Check table statistics
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'sherk_stakes';

-- 8. Test RLS with auth context
-- This simulates what happens when a user tries to insert
SELECT 
  'RLS Test' as test_type,
  COUNT(*) as accessible_rows
FROM sherk_stakes 
WHERE user_id = '1ddbd059-7d23-426e-9610-4d5e2f35849c'; 