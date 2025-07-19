import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Gift, Coins, Zap, ArrowRight, X } from 'lucide-react'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import { GlowButton } from '../components/UI/GlowButton'

export function Landing() {
  const [selectedSide, setSelectedSide] = useState<'giveaways' | 'token' | null>(null)
  const [hoveredSide, setHoveredSide] = useState<'giveaways' | 'token' | null>(null)
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    setTimeout(() => navigate(path), 500)
  }

  const handleSideClick = (side: 'giveaways' | 'token') => {
    setSelectedSide(side)
  }

  const handleClose = () => {
    setSelectedSide(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      <ParticleBackground />
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Close Button */}
      <AnimatePresence>
        {selectedSide && (
          <motion.button
            className="absolute top-8 right-8 z-30 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            onClick={handleClose}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-5 w-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side Switcher */}
      <AnimatePresence>
        {selectedSide && (
          <motion.div
            className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 flex bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => handleSideClick('giveaways')}
              className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                selectedSide === 'giveaways' 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gift className="h-4 w-4" />
              NSM Giveaways
            </button>
            <button
              onClick={() => handleSideClick('token')}
              className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                selectedSide === 'token' 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Coins className="h-4 w-4" />
              NSM Token
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Split Screen Layout */}
      <div className="h-screen flex relative">
        {/* Giveaways Side */}
        <motion.div
          className={`relative cursor-pointer transition-all duration-700 ease-in-out ${
            selectedSide === 'token' 
              ? 'flex-[0.05] opacity-20 pointer-events-none' 
              : selectedSide === 'giveaways'
                ? 'flex-[0.95]'
                : hoveredSide === 'giveaways'
                  ? 'flex-[0.6]'
                  : hoveredSide === 'token'
                    ? 'flex-[0.4] opacity-70'
                    : 'flex-[0.5]'
          }`}
          onClick={() => !selectedSide && handleSideClick('giveaways')}
          onMouseEnter={() => !selectedSide && setHoveredSide('giveaways')}
          onMouseLeave={() => !selectedSide && setHoveredSide(null)}
        >
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-900/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Animated Border Glow */}
          <motion.div
            className="absolute inset-0 border-r-2 border-green-500/30"
            animate={{
              borderColor: hoveredSide === 'giveaways' || selectedSide === 'giveaways'
                ? 'rgba(34, 197, 94, 0.6)'
                : 'rgba(34, 197, 94, 0.3)'
            }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="relative h-full flex flex-col justify-center items-center p-8 text-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                scale: selectedSide === 'giveaways' ? 1.05 : 1
              }}
              transition={{ duration: 0.6 }}
              className="max-w-lg w-full"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-40 h-40 bg-gradient-to-br from-green-500/30 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-green-500/50 overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="/mainlogo.jpg" alt="NSM Main Logo" className="w-full h-full object-cover" />
                </motion.div>
                <motion.h2 
                  className="text-5xl font-heading font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent"
                  animate={{ 
                    scale: hoveredSide === 'giveaways' || selectedSide === 'giveaways' ? 1.05 : 1 
                  }}
                >
                  NSM Giveaways
                </motion.h2>
                <p className="text-gray-300 text-xl leading-relaxed">
                  Authentic giveaways from the Meme King. Join our community and win real KAS. 
                  No lies, no cheats - just genuine opportunities.
                </p>
              </div>
              
              <AnimatePresence>
                {selectedSide === 'giveaways' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <GlowButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigation('/giveaways')
                      }}
                      icon={ArrowRight}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl shadow-green-500/30 text-lg px-8 py-4"
                    >
                      Enter Giveaways Portal
                    </GlowButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Central Divider with Logo */}
        <motion.div 
          className="relative flex-shrink-0 flex items-center justify-center"
          style={{ width: selectedSide ? '4px' : '120px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Enhanced Divider Line */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500 to-transparent"
            style={{ width: '2px', left: '50%', transform: 'translateX(-50%)' }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-primary-500/50 blur-md animate-pulse"></div>
          </motion.div>

          {/* Enhanced Central Logo */}
          <AnimatePresence>
            {!selectedSide && (
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ scale: 0, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0, opacity: 0, rotateY: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div className="relative mb-6">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/50 border-2 border-primary-300/50"
                    animate={{ 
                      rotate: 360,
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                        "0 0 40px rgba(59, 130, 246, 0.8)",
                        "0 0 20px rgba(59, 130, 246, 0.5)"
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                    }}
                  >
                    <Zap className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl animate-ping"></div>
                </div>
                <motion.div 
                  className="text-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent mb-2">
                    NSM
                  </h1>
                  <p className="text-primary-300 text-sm whitespace-nowrap animate-pulse">
                    Choose Your Universe
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Token Side */}
        <motion.div
          className={`relative cursor-pointer transition-all duration-700 ease-in-out ${
            selectedSide === 'giveaways' 
              ? 'flex-[0.05] opacity-20 pointer-events-none' 
              : selectedSide === 'token'
                ? 'flex-[0.95]'
                : hoveredSide === 'token'
                  ? 'flex-[0.6]'
                  : hoveredSide === 'giveaways'
                    ? 'flex-[0.4] opacity-70'
                    : 'flex-[0.5]'
          }`}
          onClick={() => !selectedSide && handleSideClick('token')}
          onMouseEnter={() => !selectedSide && setHoveredSide('token')}
          onMouseLeave={() => !selectedSide && setHoveredSide(null)}
        >
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/40 via-primary-900/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Animated Border Glow */}
          <motion.div
            className="absolute inset-0 border-l-2 border-primary-500/30"
            animate={{
              borderColor: hoveredSide === 'token' || selectedSide === 'token'
                ? 'rgba(59, 130, 246, 0.6)'
                : 'rgba(59, 130, 246, 0.3)'
            }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="relative h-full flex flex-col justify-center items-center p-8 text-center">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                scale: selectedSide === 'token' ? 1.05 : 1
              }}
              transition={{ duration: 0.6 }}
              className="max-w-lg w-full"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-40 h-40 bg-gradient-to-br from-primary-500/30 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-primary-500/50 overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="/tiger3.jpg" alt="NSM Tiger Logo" className="w-full h-full object-cover" />
                </motion.div>
                <motion.h2 
                  className="text-5xl font-heading font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                  animate={{ 
                    scale: hoveredSide === 'token' || selectedSide === 'token' ? 1.05 : 1 
                  }}
                >
                  NSM Token
                </motion.h2>
                <p className="text-gray-300 text-xl leading-relaxed">
                  Revolutionary KRC20 token with NFT staking utility. Hold the NFT, earn the meme. 
                  Join the future of community-driven rewards.
                </p>
              </div>
              
              <AnimatePresence>
                {selectedSide === 'token' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <GlowButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigation('/token')
                      }}
                      icon={ArrowRight}
                      size="lg"
                      className="bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-2xl shadow-primary-500/30 text-lg px-8 py-4"
                    >
                      Explore NSM Token
                    </GlowButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Bottom Quote */}
      <motion.div
        className="w-full flex justify-center items-center absolute bottom-8 left-0 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="italic text-gray-300 text-lg text-center">
          "We collect first. Then we split." - NSM
        </span>
      </motion.div>
    </div>
  )
}