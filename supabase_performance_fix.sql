-- Supabase Performance Optimization Script
-- Run this in your Supabase SQL Editor to fix connection issues

-- 1. Check current database performance
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'sherk_stakes';

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_user_id ON sherk_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_status ON sherk_stakes(status);
CREATE INDEX IF NOT EXISTS idx_sherk_stakes_created_at ON sherk_stakes(created_at);

-- 3. Analyze table statistics
ANALYZE sherk_stakes;

-- 4. Check RLS policy performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM sherk_stakes 
WHERE user_id = auth.uid() 
LIMIT 1;

-- 5. Optimize table structure
ALTER TABLE sherk_stakes SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

-- 6. Check for any locks or blocking queries
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT LIKE '%pg_stat_activity%';

-- 7. Verify table permissions
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'sherk_stakes';

-- 8. Test insert performance
EXPLAIN (ANALYZE, BUFFERS) 
INSERT INTO sherk_stakes (
  user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
) VALUES (
  'test-user-id', 'test', 'test', 0, 0, 0, 0, 'active'
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = NOW();

-- 9. Clean up test data
DELETE FROM sherk_stakes WHERE nickname = 'test'; 