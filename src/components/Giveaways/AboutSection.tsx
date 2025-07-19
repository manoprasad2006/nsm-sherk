import React from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            About NSM
          </h2>
          <p className="text-xl text-gray-400">
            The Meme King's Mission & Vision
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                As the owner of NSM Giveaways, I'm a passionate entrepreneur dedicated to creating exciting opportunities for communities through giveaways that spark joy and engagement. NSM Giveaways is a platform designed to offer participants a chance to win amazing prizes—like #KRC20 tokens, #KRC721 NFTs, and $KASPA—while fostering a sense of connection and fun.
              </p>
              <p>
                <span className="font-bold text-primary-400">Mission:</span> Deliver transparent, fair, and thrilling giveaway experiences, building trust with our audience through clear rules, verified processes, and high-quality rewards. We partner with brands and creators to bring unique value, ensuring every giveaway feels special.
              </p>
              <p>
                <span className="font-bold text-primary-400">Community:</span> The heart of the project lies in community-building and giving back—whether it's through rewarding loyal followers or supporting causes we care about.
              </p>
              <div className="bg-dark-900/60 rounded-lg p-4 text-sm text-primary-300">
                <span className="font-bold">Portfolio/Personal Wallet:</span><br />
                kaspa:qpjkdda2a9p8y2yu0rddajfj9anajgjhh0htwgqdglxuu40c5juskw6n8y3de
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-full h-80 rounded-2xl border border-green-500/30 overflow-hidden flex items-center justify-center relative">
              <img
                src="/about.jpg"
                alt="About NSM"
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ objectPosition: 'center' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 