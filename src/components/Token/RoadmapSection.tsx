import React from 'react'
import { motion } from 'framer-motion'
import { Map } from 'lucide-react'

interface RoadmapItem {
  phase: string
  title: string
  status: string
  description: string
}

interface RoadmapSectionProps {
  roadmapItems: RoadmapItem[]
}

export function RoadmapSection({ roadmapItems }: RoadmapSectionProps) {
  return (
    <section id="roadmap" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Development Roadmap
          </h2>
          <p className="text-xl text-gray-400">
            Our journey to revolutionize meme token utility
          </p>
        </motion.div>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-primary-500 to-gray-600"></div>
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative flex items-start space-x-6"
              >
                <div className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4
                  ${item.status === 'completed' ? 'bg-green-500 border-green-400' : 
                    item.status === 'active' ? 'bg-primary-500 border-primary-400 animate-pulse' : 
                    'bg-gray-600 border-gray-500'}
                `}>
                  {item.status === 'completed' ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : item.status === 'active' ? (
                    <Map className="w-8 h-8 text-white" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 bg-dark-800/50 border border-dark-700 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-primary-400">{item.phase}</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${item.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        item.status === 'active' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'}
                    `}>
                      {item.status === 'completed' ? '✅ Completed' : 
                        item.status === 'active' ? '🚀 In Progress' : '🔮 Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 