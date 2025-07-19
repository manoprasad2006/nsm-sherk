import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Twitter, MessageCircle, Youtube, Github } from 'lucide-react'

export function Footer() {
  const socialLinks = [
    { icon: MessageCircle, href: '#', label: 'Telegram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Github, href: '#', label: 'Discord' },
  ]

  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Zap className="h-8 w-8 text-primary-500 animate-float" />
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
              </div>
              <span className="text-xl font-heading font-bold text-white">NSM</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building the future of meme culture with authentic giveaways and revolutionary token utility.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-dark-700 transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Giveaways */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Giveaways</h3>
            <ul className="space-y-2 text-sm">
              {['About NSM', 'Ongoing Campaigns', 'Winner History', 'How to Enter', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Token */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">NSM Token</h3>
            <ul className="space-y-2 text-sm">
              {['Tokenomics', 'NFT Staking', 'Roadmap', 'Whitepaper', 'Community'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {['Contact Us', 'Terms of Service', 'Privacy Policy', 'Donate', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 NSM Ecosystem. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-4 md:mt-0">
            "I don't lie. I don't cheat. I'm the one." - NSM
          </p>
        </div>
      </div>
    </footer>
  )
}