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
              <img src="/tiger3.jpg" alt="$SHERK Tiger Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
            Hold the NFT.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-500">
              Earn the Meme.
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Revolutionary KRC20 token with NFT staking utility. Join the future of 
            community-driven rewards and earn passive income through your $SHERK NFTs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton size="lg">
              <PieChart className="h-6 w-6" />
              View Tokenomics
            </GlowButton>
            {user ? (
              <Link to="/dashboard">
                <GlowButton size="lg" variant="outline">
                  <LinkIcon className="h-6 w-6" />
                  Go to Dashboard
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