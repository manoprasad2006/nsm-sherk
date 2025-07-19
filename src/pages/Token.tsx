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
    { label: 'Community Open Mint', percentage: 70, color: '#1BD6D1' },
    { label: 'Future Developments', percentage: 5, color: '#06B6D4' },
    { label: 'Airdrop for NFT Holders', percentage: 5, color: '#0891B2' },
    { label: 'Giveaways & Marketing', percentage: 5, color: '#0E7490' },
    { label: 'Exchange Listings, Dex & Pools', percentage: 5, color: '#164E63' },
    { label: 'Team (In Future)', percentage: 5, color: '#164E63' },
    { label: 'Dev Wallet', percentage: 5, color: '#164E63' },
  ]

  const roadmapItems = [
    { phase: 'Phase 1', title: 'NFT Mint', status: 'completed', description: 'Successful launch of $SHERK NFT collection with utility features' },
    { phase: 'Phase 2', title: 'Bot Integration', status: 'completed', description: 'Telegram bot for community management and giveaway automation' },
    { phase: 'Phase 3', title: 'NFT Staking', status: 'active', description: 'Launch staking platform with reward distribution system' },
    { phase: 'Phase 4', title: 'Multi-chain', status: 'upcoming', description: 'Expand to multiple blockchain networks for broader accessibility' },
  ]

  const nftUtilities = [
    {
      type: 'Rare NFT',
      slots: '2 Slots',
      multiplier: '2x Rewards',
      description: 'Maximum earning potential with premium staking slots'
    },
    {
      type: 'Common NFT',
      slots: '0.5 Slot',
      multiplier: '1x Rewards',
      description: 'Entry-level staking with steady reward accumulation'
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