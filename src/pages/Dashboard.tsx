import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Gem, Wallet, TrendingUp, Clock, Award, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, MiningRig } from '../lib/supabase'
import { GlowButton } from '../components/UI/GlowButton'
import { Navbar } from '../components/Layout/Navbar'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import toast, { Toaster } from 'react-hot-toast'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [miningRig, setMiningRig] = useState<MiningRig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    fetchMiningRig()
  }, [user, navigate])

  const fetchMiningRig = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('mining_rigs')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        navigate('/stake-form')
        return
      }

      setMiningRig(data)
    } catch (error) {
      navigate('/stake-form')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    if (!miningRig) return { totalSlots: 0, weeklyReward: 0, monthlyReward: 0 }
    
    const totalSlots = (miningRig.rare_nfts * 2) + (miningRig.common_nfts * 0.5)
    const weeklyReward = totalSlots * 10 // Dummy calculation
    const monthlyReward = weeklyReward * 4

    return { totalSlots, weeklyReward, monthlyReward }
  }

  const refreshData = async () => {
    toast('Refreshing staking data...', { icon: '🔄' })
    await fetchMiningRig()
    toast.success('Data refreshed!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!miningRig) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No staking setup found</p>
          <GlowButton onClick={() => navigate('/stake-form')}>
            Setup Staking
          </GlowButton>
        </div>
      </div>
    )
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-dark-900">
      <ParticleBackground />
      <Navbar variant="token" />
      <Toaster position="top-center" />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-2">
                  Staking Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome back, {user?.email}
                </p>
              </div>
              <GlowButton onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </GlowButton>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 border border-primary-500/30 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-500/30 rounded-lg flex items-center justify-center">
                    <Gem className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalSlots}</p>
                    <p className="text-sm text-gray-400">Total Slots</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.weeklyReward} $SHERK</p>
                    <p className="text-sm text-gray-400">Weekly $SHERK</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.monthlyReward} $SHERK</p>
                    <p className="text-sm text-gray-400">Monthly $SHERK</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">4</p>
                    <p className="text-sm text-gray-400">Days to Payout</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Staking Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Staking Details</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Wallet Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <p className="text-white font-mono text-sm break-all">
                          {miningRig.wallet_address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Rig Name
                      </label>
                      <p className="text-white">{miningRig.rig_name}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Rare NFTs
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-500/30 rounded flex items-center justify-center">
                          <Gem className="h-3 w-3 text-yellow-400" />
                        </div>
                        <p className="text-white">
                          {miningRig.rare_nfts} NFTs ({miningRig.rare_nfts * 2} slots)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Common NFTs
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary-500/30 rounded flex items-center justify-center">
                          <Gem className="h-3 w-3 text-primary-400" />
                        </div>
                        <p className="text-white">
                          {miningRig.common_nfts} NFTs ({miningRig.common_nfts * 0.5} slots)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Telegram
                    </label>
                    <p className="text-white">{miningRig.telegram_id}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reward Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 border border-primary-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Next Payout</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-400 mb-2">
                    {stats.weeklyReward} $SHERK
                  </p>
                  <p className="text-gray-400 text-sm mb-4">Estimated weekly reward</p>
                  <div className="bg-dark-700/50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">3/7 days</span>
                    </div>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full" style={{ width: '43%' }}></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Next payout in 4 days
                  </p>
                </div>
              </div>

              <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Staking Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Earned</span>
                    <span className="text-white font-medium">0 $SHERK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Since</span>
                    <span className="text-white font-medium">
                      {new Date(miningRig.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">Important Note</h3>
                <p className="text-yellow-300 text-sm">
                  Reward calculations are currently using dummy data. 
                  Actual staking rewards will be implemented in the next update.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}