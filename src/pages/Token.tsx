import React from 'react'
import { Navbar } from '../components/Layout/Navbar'
import { Footer } from '../components/Layout/Footer'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import { useAuth } from '../contexts/AuthContext'
import { HeroSection } from '../components/Token/HeroSection'
import { TokenomicsSection } from '../components/Token/TokenomicsSection'
import { RoadmapSection } from '../components/Token/RoadmapSection'
import { NFTUtilitySection } from '../components/Token/NFTUtilitySection'
import { CommunitySection } from '../components/Token/CommunitySection'
import { DocumentationSection } from '../components/Token/DocumentationSection'

export function Token() {
  const { user } = useAuth()

  const tokenomics = [
    { label: 'Premint', percentage: 70, color: '#1BD6D1' },
    { label: 'Public Mint', percentage: 30, color: '#06B6D4' },
  ]

  const roadmapItems = [
    { phase: 'Phase 1', title: 'Token Launch', status: 'completed', description: 'SHERK token launch on BLOCKDAG (Kaspa) network with 999,999,999 total supply' },
    { phase: 'Phase 2', title: 'NFT Collection', status: 'completed', description: '2222 SHERK NFTs with 4 rarity tiers and pickaxe staking mechanics' },
    { phase: 'Phase 3', title: 'Staking Platform', status: 'active', description: 'Manual staking system with weekly rewards via kaspa.com airdrop' },
    { phase: 'Phase 4', title: 'Strategic Partnerships', status: 'upcoming', description: 'Expand ecosystem partnerships and community growth initiatives' },
    { phase: 'Phase 5', title: 'Charity Integration', status: 'upcoming', description: 'Direct integration with white tiger conservation initiatives' },
  ]

  const nftUtilities = [
    {
      type: 'BOOM NFT',
      slots: '4 Pickaxes',
      multiplier: '6,248 SHERK/week',
      description: 'Ultra rare NFTs with maximum earning potential',
      rarity: '54 total'
    },
    {
      type: 'Ultra Rare NFT',
      slots: '3 Pickaxes',
      multiplier: '4,686 SHERK/week',
      description: 'High-value NFTs with excellent reward rates',
      rarity: '333 total'
    },
    {
      type: 'Rare NFT',
      slots: '2 Pickaxes',
      multiplier: '3,124 SHERK/week',
      description: 'Premium NFTs with strong earning potential',
      rarity: '555 total'
    },
    {
      type: 'Common NFT',
      slots: '1 Pickaxe',
      multiplier: '1,562 SHERK/week',
      description: 'Entry-level NFTs with steady reward accumulation',
      rarity: '1110 total'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <ParticleBackground />
      <Navbar variant="token" />
      <HeroSection user={user} />
      <TokenomicsSection tokenomics={tokenomics} />
      <RoadmapSection roadmapItems={roadmapItems} />
      <NFTUtilitySection nftUtilities={nftUtilities} user={user} />
      <CommunitySection />
      <DocumentationSection />
      <Footer />
    </div>
  )
}