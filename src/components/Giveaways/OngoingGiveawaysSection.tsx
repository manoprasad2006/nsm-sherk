import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Users, Clock, ExternalLink } from 'lucide-react'
import { GlowButton } from '../UI/GlowButton'

interface Giveaway {
  title: string
  prize: string
  timeLeft: string
  entries: number
  maxEntries: number
  color: string
  icon: React.ComponentType<any>
  requirements: string[]
}

interface OngoingGiveawaysSectionProps {
  giveaways: Giveaway[]
}

export function OngoingGiveawaysSection() {
  const handleEnterGiveaway = () => {
    window.open('https://t.me/+LjE29TZp-1FlMDQ9', '_blank');
  };

  return (
    <section id="giveaways" className="py-20 bg-dark-800/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-dark-700/80 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8"
        >
          {/* Image section */}
          <div className="flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden bg-dark-800 flex items-center justify-center">
            <img
              src="/gwtrail.jpg"
              alt="Giveaway"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content section */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">🎉 Join the Giveaway! 🎉</h2>
            <p className="text-lg text-primary-400 font-semibold mb-4">
              99K $KYRO Tokens to 3 Lucky winners! Who's ready to fly this dragon 🐉
            </p>
            <div className="bg-dark-800/60 rounded-xl p-4 mb-4 text-white text-left">
              <div className="mb-2 font-semibold">Prizes:</div>
              <ul className="list-decimal list-inside ml-4 mb-2">
                <li>33k $KYRO Tokens</li>
                <li>33k $KYRO Tokens</li>
                <li>33k $KYRO Tokens</li>
              </ul>
              <div className="mb-1">Winners: <span className="font-semibold">3</span></div>
              <div className="mb-1">Ends: <span className="font-semibold">6/28/2025, 2:32:24 PM</span></div>
              <div className="mb-1">Eligibility: <span className="font-semibold">Minimum activity level 3</span></div>
            </div>
            <p className="text-gray-300 mb-4">Follow the instructions to win amazing prizes! A reroll may occur if winners don't complete tasks.</p>
            <GlowButton 
              onClick={handleEnterGiveaway}
              className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl"
            >
              🚀 Enter Giveaway
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 