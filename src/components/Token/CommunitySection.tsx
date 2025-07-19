import React from 'react'
import { motion } from 'framer-motion'

export function CommunitySection() {
  return (
    <section id="community" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Join the Community
          </h2>
          <p className="text-xl text-gray-400">
            Connect with fellow NSM holders and stay updated
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Telegram', icon: '💬', members: '5,000+', color: 'from-blue-500 to-blue-600' },
            { name: 'Twitter/X', icon: '🐦', members: '2,500+', color: 'from-blue-400 to-blue-500' },
            { name: 'Discord', icon: '🎮', members: '1,200+', color: 'from-purple-500 to-purple-600' },
            { name: 'YouTube', icon: '📺', members: '800+', color: 'from-red-500 to-red-600' },
          ].map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${platform.color} p-6 rounded-xl text-center text-white cursor-pointer transform hover:scale-105 transition-transform`}
            >
              <div className="text-4xl mb-3">{platform.icon}</div>
              <h3 className="text-lg font-bold mb-1">{platform.name}</h3>
              <p className="text-sm opacity-90">{platform.members} members</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 