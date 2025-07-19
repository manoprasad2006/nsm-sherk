import React from 'react'
import { motion } from 'framer-motion'
import { Gem, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowButton } from '../UI/GlowButton'

interface NFTUtility {
  type: string
  slots: string
  multiplier: string
  description: string
}

interface NFTUtilitySectionProps {
  nftUtilities: NFTUtility[]
  user: any
}

export function NFTUtilitySection({ nftUtilities, user }: NFTUtilitySectionProps) {
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
            NFT Utility & Staking
          </h2>
          <p className="text-xl text-gray-400">
            Your NFTs are your ticket to earning $SHERK tokens
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
                ${nft.type === 'Rare NFT' 
                  ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                  : 'bg-gradient-to-br from-primary-500/10 to-blue-500/10 border-primary-500/30'}
              `}
            >
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
                ${nft.type === 'Rare NFT' ? 'bg-yellow-500/30' : 'bg-primary-500/30'}
              `}>
                <Gem className={`h-10 w-10 ${nft.type === 'Rare NFT' ? 'text-yellow-400' : 'text-primary-400'}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{nft.type}</h3>
              <div className="space-y-2 mb-6">
                <p className={`text-lg font-semibold ${nft.type === 'Rare NFT' ? 'text-yellow-400' : 'text-primary-400'}`}>
                  {nft.slots}
                </p>
                <p className={`text-sm ${nft.type === 'Rare NFT' ? 'text-yellow-300' : 'text-primary-300'}`}>
                  {nft.multiplier}
                </p>
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
          <div className="bg-dark-800/50 border border-primary-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">How Staking Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">1</span>
                </div>
                <p className="text-white font-medium mb-2">Connect Wallet</p>
                <p className="text-gray-400 text-sm">Link your Kaspa wallet with $SHERK NFTs</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">2</span>
                </div>
                <p className="text-white font-medium mb-2">Stake NFTs</p>
                <p className="text-gray-400 text-sm">Submit your NFT details for verification</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-400 font-bold">3</span>
                </div>
                <p className="text-white font-medium mb-2">Earn Rewards</p>
                <p className="text-gray-400 text-sm">Receive weekly $SHERK token distributions</p>
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