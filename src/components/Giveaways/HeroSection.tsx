import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
// import { GlowButton } from '../UI/GlowButton'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="flex flex-col md:flex-row items-center gap-14 w-full max-w-5xl">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 40px 0 #1BD6D1' }}
              whileTap={{ scale: 0.98 }}
              className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg flex-shrink-0 bg-dark-800 transition-all duration-150"
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/ttlogo.jpg"
                alt="NSM Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-2 mb-6"
              >
                <Sparkles className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">Live Giveaways Active</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl font-heading font-bold text-white mb-4"
              >
                NSM{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary-500">
                  Giveaways
                </span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-2xl md:text-3xl font-semibold text-primary-400 mb-4"
              >
                Exciting, Fair, and Transparent Giveaways for the Kaspa Community
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Join the most trusted giveaway community in KRC. Real rewards, real people, real impact. NSM doesn't lie, doesn't cheat - we're the ones who deliver.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 justify-center md:justify-start text-lg text-primary-300 font-medium mb-2"
              >
                <li>• Win $KAS, KRC20 tokens, and NFTs</li>
                <li>• Community-driven, trusted, and fun</li>
                <li>• No spam, no scams—just real rewards</li>
              </motion.ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
