import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Gem, Wallet, MessageCircle, RefreshCw, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GlowButton } from '../components/UI/GlowButton'
import { Navbar } from '../components/Layout/Navbar'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import toast, { Toaster } from 'react-hot-toast'

export function StakeForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    walletAddress: '',
    rigName: '',
    rareNfts: 0,
    commonNfts: 0,
    telegramId: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Check if user already has a mining rig setup
    checkExistingRig()
  }, [user, navigate])

  const checkExistingRig = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('mining_rigs')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        navigate('/dashboard')
      }
    } catch (error) {
      // User doesn't have a rig yet, continue with form
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    console.log('Submitting staking form:', formData)
    console.log('About to insert into Supabase')

    try {
      const { error } = await supabase
        .from('mining_rigs')
        .insert({
          user_id: user.id,
          wallet_address: formData.walletAddress,
          rig_name: formData.rigName,
          rare_nfts: formData.rareNfts,
          common_nfts: formData.commonNfts,
          telegram_id: formData.telegramId
        })
      console.log('Insert finished', error)

      if (error) {
        toast.error('Failed to save staking information')
        console.error('Supabase insert error:', error)
      } else {
        toast.success('Staking setup completed!')
        console.log('Staking setup successful, navigating to dashboard')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error('Failed to save staking information')
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchNfts = async () => {
    toast('API not implemented yet - Please enter NFT counts manually', {
      icon: '⚠️',
      duration: 4000
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <ParticleBackground />
      <Navbar variant="token" />
      <Toaster position="top-center" />

      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gem className="h-8 w-8 text-primary-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              Setup Your Staking
            </h1>
            <p className="text-gray-400">
              Provide your NFT and wallet information to start earning rewards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kaspa Wallet Address
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-mono text-sm"
                    placeholder="kaspa:qp7x8z9y2a3b4c5d..."
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your Kaspa wallet address where you hold $SHERK NFTs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mining Rig Name
                </label>
                <input
                  type="text"
                  value={formData.rigName}
                  onChange={(e) => handleInputChange('rigName', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="My $SHERK Staking Rig"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  A friendly name for your staking setup
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rare NFTs
                  </label>
                  <input
                    type="number"
                    value={formData.rareNfts}
                    onChange={(e) => handleInputChange('rareNfts', parseInt(e.target.value) || 0)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    min="0"
                    placeholder="0"
                  />
                  <p className="text-xs text-yellow-400 mt-1">
                    2 staking slots each • 2x rewards
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Common NFTs
                  </label>
                  <input
                    type="number"
                    value={formData.commonNfts}
                    onChange={(e) => handleInputChange('commonNfts', parseInt(e.target.value) || 0)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    min="0"
                    placeholder="0"
                  />
                  <p className="text-xs text-primary-400 mt-1">
                    0.5 staking slots each • 1x rewards
                  </p>
                </div>
              </div>

              <div className="bg-dark-700/50 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Auto-Fetch NFTs</span>
                  <GlowButton
                    type="button"
                    onClick={handleFetchNfts}
                    size="sm"
                    variant="outline"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Fetch NFTs
                  </GlowButton>
                </div>
                <p className="text-sm text-gray-400">
                  Click to automatically detect NFTs in your wallet (API integration coming soon)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telegram Username
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.telegramId}
                    onChange={(e) => handleInputChange('telegramId', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="@username"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For community verification and reward notifications
                </p>
              </div>

              <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium mb-1">Staking Summary</p>
                    <p className="text-sm text-gray-300">
                      Total Slots: <span className="text-primary-400 font-medium">
                        {(formData.rareNfts * 2) + (formData.commonNfts * 0.5)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Est. Weekly Reward: <span className="text-primary-400 font-medium">
                        {((formData.rareNfts * 2) + (formData.commonNfts * 0.5)) * 10} $SHERK
                      </span> (dummy calculation)
                    </p>
                  </div>
                </div>
              </div>

              <GlowButton
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Setting up...' : 'Complete Staking Setup'}
              </GlowButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}