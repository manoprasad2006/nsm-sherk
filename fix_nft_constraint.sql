-- Fix NFT Constraint Issue
-- The database has a constraint requiring at least one NFT, but the form allows zero NFTs

-- 1. Check the current constraint
SELECT 
  conname,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'sherk_stakes'::regclass 
AND conname = 'at_least_one_nft';

-- 2. Drop the problematic constraint
ALTER TABLE sherk_stakes DROP CONSTRAINT IF EXISTS at_least_one_nft;

-- 3. Create a better constraint that allows zero NFTs (for testing/empty stakes)
-- This allows users to create stakes even if they don't have NFTs yet
ALTER TABLE sherk_stakes ADD CONSTRAINT at_least_one_nft 
CHECK (
  common_nfts >= 0 AND 
  rare_nfts >= 0 AND 
  ultra_rare_nfts >= 0 AND 
  boom_nfts >= 0 AND
  (common_nfts + rare_nfts + ultra_rare_nfts + boom_nfts) >= 0
);

-- 4. Test the fix with a zero NFT stake
INSERT INTO sherk_stakes (
  user_id, nickname, wallet_address, common_nfts, rare_nfts, ultra_rare_nfts, boom_nfts, status
) VALUES (
  'test-user-id', 'test-zero', 'test', 0, 0, 0, 0, 'active'
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = NOW();

-- 5. Clean up test data
DELETE FROM sherk_stakes WHERE nickname = 'test-zero';

-- 6. Verify the constraint is working
SELECT 
  conname,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'sherk_stakes'::regclass 
AND conname = 'at_least_one_nft'; 