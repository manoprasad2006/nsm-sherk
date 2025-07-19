import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Link as LinkIcon, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowButton } from '../UI/GlowButton'

interface HeroSectionProps {
  user: any
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full animate-float flex items-center justify-center mx-auto overflow-hidden">
              <img src="/tiger3.jpg" alt="SHERK Blue Tiger" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
            SHERK.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-500">
              The Blue Tiger King.
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            A next-generation token created to promote the Kaspa ecosystem and support white tigers through real charitable initiatives. 
            Our blue tiger is more than just a symbol - he is a king, a hero uniting meme culture, community power, NFT staking, and weekly rewards.
          </p>
          <div className="bg-dark-800/50 border border-primary-500/30 rounded-2xl p-6 max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-2">999,999,999</div>
                <div className="text-gray-400">Total Supply</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-2">2,222</div>
                <div className="text-gray-400">NFT Collection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-2">300M</div>
                <div className="text-gray-400">Weekly Rewards Pool</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton size="lg">
              <PieChart className="h-6 w-6" />
              View Tokenomics
            </GlowButton>
            {user ? (
              <Link to="/stake-form">
                <GlowButton size="lg" variant="outline">
                  <LinkIcon className="h-6 w-6" />
                  Start Staking
                </GlowButton>
              </Link>
            ) : (
              <Link to="/auth">
                <GlowButton size="lg" variant="outline">
                  <LogIn className="h-6 w-6" />
                  Start Staking
                </GlowButton>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 