import React from 'react'
import { motion } from 'framer-motion'
import { Gem, LogIn, Pickaxe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowButton } from '../UI/GlowButton'

interface NFTUtility {
  type: string
  slots: string
  multiplier: string
  description: string
  rarity: string
}

interface NFTUtilitySectionProps {
  nftUtilities: NFTUtility[]
  user: any
}

export function NFTUtilitySection({ nftUtilities, user }: NFTUtilitySectionProps) {
  const getRarityColor = (type: string) => {
    switch (type) {
      case 'BOOM NFT':
        return 'from-red-500/10 to-orange-500/10 border-red-500/30'
      case 'Ultra Rare NFT':
        return 'from-purple-500/10 to-pink-500/10 border-purple-500/30'
      case 'Rare NFT':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
      case 'Common NFT':
        return 'from-primary-500/10 to-blue-500/10 border-primary-500/30'
      default:
        return 'from-primary-500/10 to-blue-500/10 border-primary-500/30'
    }
  }

  const getRarityIconColor = (type: string) => {
    switch (type) {
      case 'BOOM NFT':
        return 'text-red-400'
      case 'Ultra Rare NFT':
        return 'text-purple-400'
      case 'Rare NFT':
        return 'text-yellow-400'
      case 'Common NFT':
        return 'text-primary-400'
      default:
        return 'text-primary-400'
    }
  }

  const getRarityBgColor = (type: string) => {
    switch (type) {
      case 'BOOM NFT':
        return 'bg-red-500/30'
      case 'Ultra Rare NFT':
        return 'bg-purple-500/30'
      case 'Rare NFT':
        return 'bg-yellow-500/30'
      case 'Common NFT':
        return 'bg-primary-500/30'
      default:
        return 'bg-primary-500/30'
    }
  }

  return (
    <section id="nft-utility" className="py-20 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            SHERK NFT Collection & Staking
          </h2>
          <p className="text-xl text-gray-400">
            Stake your SHERK NFTs and earn weekly rewards based on pickaxe power
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {nftUtilities.map((nft, index) => (
            <motion.div
              key={nft.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`
                border rounded-2xl p-8 text-center relative overflow-hidden
                bg-gradient-to-br ${getRarityColor(nft.type)}
              `}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${getRarityBgColor(nft.type)}`}>
                <Pickaxe className={`h-10 w-10 ${getRarityIconColor(nft.type)}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{nft.type}</h3>
              <div className="space-y-2 mb-4">
                <p className={`text-lg font-semibold ${getRarityIconColor(nft.type)}`}>
                  {nft.slots}
                </p>
                <p className={`text-sm ${getRarityIconColor(nft.type)}`}>
                  {nft.multiplier}
                </p>
                <p className="text-xs text-gray-400">{nft.rarity}</p>
              </div>
              <p className="text-gray-300 text-sm">{nft.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-dark-800/50 border border-primary-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">How SHERK Staking Works</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center mb-8">
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">1</span>
                </div>
                <p className="text-white font-medium mb-2">Mint NFT</p>
                <p className="text-gray-400 text-sm">Get your SHERK NFT from kaspa.com or KSPR Bot</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">2</span>
                </div>
                <p className="text-white font-medium mb-2">Log into SHERK Site</p>
                <p className="text-gray-400 text-sm">Connect with Google and enter your details</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">3</span>
                </div>
                <p className="text-white font-medium mb-2">Add Wallet Address</p>
                <p className="text-gray-400 text-sm">Submit your Kaspa wallet address for verification</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">4</span>
                </div>
                <p className="text-white font-medium mb-2">Earn Weekly Rewards</p>
                <p className="text-gray-400 text-sm">Receive automatic payouts via kaspa.com airdrop</p>
              </div>
            </div>
            <div className="bg-dark-700/50 rounded-xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Reward System Overview</h4>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="text-gray-300 mb-2"><span className="text-primary-400 font-semibold">Total Rewards Pool:</span> 300,000,000 SHERK</p>
                  <p className="text-gray-300 mb-2"><span className="text-primary-400 font-semibold">Duration:</span> 52 weeks</p>
                  <p className="text-gray-300 mb-2"><span className="text-primary-400 font-semibold">Reward per Pickaxe:</span> 1,562 SHERK/week</p>
                </div>
                <div>
                  <p className="text-gray-300 mb-2"><span className="text-primary-400 font-semibold">Total Pickaxes:</span> 3,686</p>
                  <p className="text-gray-300 mb-2"><span className="text-primary-400 font-semibold">Payment Method:</span> Kaspa.com airdrop</p>
                  <p className="text-gray-300 mb-2"><span className="text-primary-400 font-semibold">Security:</span> Manual processing, no smart contracts</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {user ? (
                <Link to="/stake-form">
                  <GlowButton size="lg">
                    <Gem className="h-6 w-6" />
                    Start Staking Now
                  </GlowButton>
                </Link>
              ) : (
                <Link to="/auth">
                  <GlowButton size="lg">
                    <LogIn className="h-6 w-6" />
                    Login to Stake
                  </GlowButton>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 