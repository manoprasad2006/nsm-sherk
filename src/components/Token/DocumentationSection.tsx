import React from 'react'
import { motion } from 'framer-motion'

export function DocumentationSection() {
  return (
    <section className="py-20 bg-dark-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Technical Documentation
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Dive into the details of NSM Token, smart contracts, and staking platform. All code is open source and available for review.
          </p>
          <a
            href="#"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Whitepaper
          </a>
        </motion.div>
      </div>
    </section>
  )
} 