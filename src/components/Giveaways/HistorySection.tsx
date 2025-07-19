import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star } from 'lucide-react'

interface Winner {
  name: string
  amount: string
  date: string
  verified: boolean
  avatar: string
}

interface HistorySectionProps {
  winners: Winner[]
}

export function HistorySection({ winners }: HistorySectionProps) {
  const [activeWinner, setActiveWinner] = useState(0)

  // Auto-rotate winners carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWinner((prev) => (prev + 1) % winners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [winners.length])

  return (
    <section id="history" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2 mb-6">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Verified Winners</span>
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Giveaway History
          </h2>
          <p className="text-xl text-gray-400">
            Real people, real payouts, real proof
          </p>
        </motion.div>

        {/* Animated Winners Carousel */}
        <div className="relative h-96 mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWinner}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center max-w-md">
                <div className="text-6xl mb-4">{winners[activeWinner].avatar}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{winners[activeWinner].name}</h3>
                <p className="text-3xl font-bold text-yellow-400 mb-2">{winners[activeWinner].amount}</p>
                <p className="text-gray-400 mb-4">{winners[activeWinner].date}</p>
                {winners[activeWinner].verified && (
                  <div className="inline-flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    <Star className="h-3 w-3" />
                    <span>Verified Payout</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Winner Dots */}
        <div className="flex justify-center space-x-2">
          {winners.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveWinner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeWinner ? 'bg-yellow-400' : 'bg-gray-600'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 