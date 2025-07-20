import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Pickaxe, Wallet, TrendingUp, Clock, Award, RefreshCw, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GlowButton } from '../components/UI/GlowButton'
import { Navbar } from '../components/Layout/Navbar'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import toast, { Toaster } from 'react-hot-toast'
import { DebugAuth } from '../components/DebugAuth'

interface SherkStake {
  id: string
  user_id: string
  wallet_address: string
  nickname: string
  common_nfts: number
  rare_nfts: number
  ultra_rare_nfts: number
  boom_nfts: number
  total_pickaxes: number
  weekly_reward: number
  status: string
  created_at: string
  updated_at: string
}

export function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sherkStake, setSherkStake] = useState<SherkStake | null>(null)
  const [stakeLoading, setStakeLoading] = useState(true)
  const [authTimeout, setAuthTimeout] = useState(false)
  const [renderCount, setRenderCount] = useState(0)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // Get the current session's access token
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAccessToken(session?.access_token || null)
    })
  }, [user])

  // Debug render count (only log on mount and when key values change)
  useEffect(() => {
    console.log(`Dashboard render - user:`, user?.email, 'loading:', loading, 'stakeLoading:', stakeLoading)
  }, [user?.email, loading, stakeLoading])

  console.log('Dashboard render - user:', user?.email, 'loading:', loading, 'stakeLoading:', stakeLoading, 'authTimeout:', authTimeout)

  useEffect(() => {
    console.log('Dashboard useEffect - user:', user?.email, 'loading:', loading)
    
    if (user && !loading) {
      console.log('User found and ready to fetch stake')
      // Add a small delay to ensure database consistency after form submission
      const timer = setTimeout(() => {
        fetchSherkStake()
      }, 500) // Reduced from 1000ms to 500ms
      
      return () => clearTimeout(timer)
    }
  }, [user, loading])

  // Add timeout to prevent infinite loading - only if no user and still loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !user) {
        console.log('Auth loading timeout - forcing redirect to auth')
        setAuthTimeout(true)
        navigate('/auth')
      }
    }, 5000) // Reduced from 10000ms to 5000ms

    return () => clearTimeout(timeout)
  }, [loading, user])
  
  // Add a timeout to prevent infinite stake loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (stakeLoading && user && !loading) {
        console.log('Stake loading timeout - forcing stakeLoading to false')
        setStakeLoading(false)
      }
    }, 10000) // Reduced timeout to 10 seconds

    return () => clearTimeout(timeout)
  }, [stakeLoading, user, loading])

  // Show loading while authentication is being determined
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we verify your authentication...</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Redirect if no user and not loading
  if (!user && !loading) {
    navigate('/auth')
    return null
  }

  const fetchSherkStake = async (retryCount = 0) => {
    if (!user) {
      console.log('fetchSherkStake: No user, returning early')
      return
    }

    const headers = {
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    console.log(`fetchSherkStake called with user: ${user.id}, email: ${user.email}, retry: ${retryCount}`)
    
    // Clear any cached data first
    localStorage.removeItem(`sherk_stake_${user.id}`)
    
    setStakeLoading(true)
    
    // Add a timeout for stake loading
    const loadingTimeout = setTimeout(() => {
      console.log('Stake loading timeout - setting loading to false')
      setStakeLoading(false)
    }, 10000) // Reduced timeout to 10 seconds
    
    try {
      console.log('Fetching fresh data from database...')
      console.log('URL:', `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?user_id=eq.${user.id}`)
      
      // Use direct REST API instead of Supabase client
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?user_id=eq.${user.id}`, {
        method: 'GET',
        headers
      })
      
      console.log('Dashboard fetch response status:', response.status)
      console.log('Dashboard fetch response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Dashboard fetch error response:', errorText)
        
        // If it's a 401 or 403, the user might need to re-authenticate
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error, redirecting to auth')
          navigate('/auth')
          return
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Dashboard fetch result:', data)
      console.log('Dashboard fetch result length:', data ? data.length : 'null')
      
      if (data && data.length > 0) {
        console.log('Stake found:', data[0])
        setSherkStake(data[0])
        // Clear the fromStakeForm state since we found the stake
        if (location.state?.fromStakeForm) {
          navigate(location.pathname, { replace: true, state: {} })
        }
        // Clear any cached data to ensure fresh data
        localStorage.removeItem(`sherk_stake_${user.id}`)
      } else {
        console.log('No stake found for user - data is empty or null')
        
        // If this is the first attempt and user just came from stake form, retry multiple times
        if (retryCount < 3 && location.state?.fromStakeForm) {
          console.log(`User just submitted stake form, retrying fetch in ${(retryCount + 1) * 1} seconds... (attempt ${retryCount + 1}/3)`)
          setTimeout(() => {
            fetchSherkStake(retryCount + 1)
          }, (retryCount + 1) * 1000) // Reduced from 2000ms to 1000ms
          return
        }
        
        setSherkStake(null)
      }
      
    } catch (error) {
      console.error('Error fetching stake:', error)
      
      // If this is the first attempt and user just came from stake form, retry once
      if (retryCount === 0 && location.state?.fromStakeForm) {
        console.log('Error occurred, retrying fetch in 3 seconds...')
        setTimeout(() => {
          fetchSherkStake(retryCount + 1)
        }, 3000)
        return
      }
      
      setSherkStake(null)
    } finally {
      console.log('Setting stakeLoading to false')
      clearTimeout(loadingTimeout)
      setStakeLoading(false)
    }
  }

  const calculateStats = () => {
    if (!sherkStake) return { 
      totalPickaxes: 0, 
      weeklyReward: 0, 
      monthlyReward: 0,
      totalNfts: 0,
      total52WeekReward: 0
    }
    
    // Calculate total pickaxes from NFT counts
    const totalPickaxes = (sherkStake.common_nfts * 1) + 
                         (sherkStake.rare_nfts * 2) + 
                         (sherkStake.ultra_rare_nfts * 3) + 
                         (sherkStake.boom_nfts * 4)
    
    // Calculate weekly reward from NFT counts
    const weeklyReward = (sherkStake.common_nfts * 1562) + 
                        (sherkStake.rare_nfts * 3124) + 
                        (sherkStake.ultra_rare_nfts * 4686) + 
                        (sherkStake.boom_nfts * 6248)
    
    const monthlyReward = weeklyReward * 4
    const totalNfts = sherkStake.common_nfts + sherkStake.rare_nfts + sherkStake.ultra_rare_nfts + sherkStake.boom_nfts
    const total52WeekReward = weeklyReward * 52

    return { totalPickaxes, weeklyReward, monthlyReward, totalNfts, total52WeekReward }
  }

  const refreshData = async () => {
    toast('Refreshing staking data...', { icon: '🔄' })
    await fetchSherkStake(0)
    toast.success('Data refreshed!')
  }

  // Show loading while fetching stake data
  if (stakeLoading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <ParticleBackground />
        <Navbar variant="token" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to SHERK Staking</h2>
            <p className="text-gray-400 mb-6">
              {location.state?.fromStakeForm ? 'Processing your stake submission...' : 'Loading your staking data...'}
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            {location.state?.fromStakeForm && (
              <p className="text-gray-500 text-sm mt-4">This may take a few moments...</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // If no stake found, show a more user-friendly message with options
  if (!sherkStake && !stakeLoading) {
    console.log('No stake found, showing user-friendly message')
    
    // Check if user just came from stake form submission
    const justSubmitted = location.state?.fromStakeForm || false
    
    // Don't show the "no stake" message if we're still in the initial loading phase
    if (justSubmitted && Date.now() - (location.state?.timestamp || 0) < 10000) {
      return (
        <div className="min-h-screen bg-dark-900">
          <ParticleBackground />
          <Navbar variant="token" />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to SHERK Staking</h2>
              <p className="text-gray-400 mb-6">Processing your stake submission...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          </div>
        </div>
      )
    }
    
    // If user just submitted, show a different message
    if (justSubmitted) {
      return (
        <div className="min-h-screen bg-dark-900">
          <ParticleBackground />
          <Navbar variant="token" />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to SHERK Staking</h2>
              <p className="text-gray-400 mb-6">
                Your stake has been submitted! It may take a moment to appear. Please refresh or wait a moment.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => fetchSherkStake(0)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Refresh Data
                </button>
                <button 
                  onClick={() => navigate('/stake-form')}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Create Stake
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen bg-dark-900">
        <ParticleBackground />
        <Navbar variant="token" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to SHERK Staking</h2>
            <p className="text-gray-400 mb-6">
              You haven't created a stake yet. Start staking your SHERK NFTs to earn weekly rewards!
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => fetchSherkStake(0)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh Data
              </button>
              <button 
                onClick={() => navigate('/stake-form')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Update Form
              </button>
            </div>
          </div>
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
      {/* <DebugAuth /> */}

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
                  SHERK Staking Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome back, {sherkStake.nickname || user?.email}
                </p>
              </div>
              <div className="flex space-x-2">
                <GlowButton onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </GlowButton>
                <GlowButton onClick={() => navigate('/stake-form')} variant="outline" size="sm">
                  Update Form
                </GlowButton>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 border border-primary-500/30 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-500/30 rounded-lg flex items-center justify-center">
                    <Pickaxe className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalPickaxes}</p>
                    <p className="text-sm text-gray-400">Total Pickaxes</p>
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
                    <p className="text-2xl font-bold text-white">{stats.weeklyReward.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Weekly SHERK</p>
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
                    <p className="text-2xl font-bold text-white">{stats.monthlyReward.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Monthly SHERK</p>
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
                    <p className="text-2xl font-bold text-white">{stats.total52WeekReward.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">52-Week Total</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-red-500/30 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalNfts}</p>
                    <p className="text-sm text-gray-400">Total NFTs</p>
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
                <h2 className="text-xl font-bold text-white mb-6">SHERK Staking Details</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Wallet Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <p className="text-white font-mono text-sm break-all">
                          {sherkStake.wallet_address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nickname
                      </label>
                      <p className="text-white">{sherkStake.nickname}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        BOOM NFTs
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-500/30 rounded flex items-center justify-center">
                          <Pickaxe className="h-3 w-3 text-red-400" />
                        </div>
                        <p className="text-white">
                          {sherkStake.boom_nfts} NFTs ({sherkStake.boom_nfts * 4} pickaxes)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Ultra Rare NFTs
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500/30 rounded flex items-center justify-center">
                          <Pickaxe className="h-3 w-3 text-purple-400" />
                        </div>
                        <p className="text-white">
                          {sherkStake.ultra_rare_nfts} NFTs ({sherkStake.ultra_rare_nfts * 3} pickaxes)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Rare NFTs
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-500/30 rounded flex items-center justify-center">
                          <Pickaxe className="h-3 w-3 text-yellow-400" />
                        </div>
                        <p className="text-white">
                          {sherkStake.rare_nfts} NFTs ({sherkStake.rare_nfts * 2} pickaxes)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Common NFTs
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary-500/30 rounded flex items-center justify-center">
                          <Pickaxe className="h-3 w-3 text-primary-400" />
                        </div>
                        <p className="text-white">
                          {sherkStake.common_nfts} NFTs ({sherkStake.common_nfts * 1} pickaxes)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                        <p className="text-white font-medium mb-1">Reward Summary</p>
                        <p className="text-sm text-gray-300">
                          Weekly Reward: <span className="text-primary-400 font-medium">
                            {stats.weeklyReward.toLocaleString()} SHERK
                          </span>
                        </p>
                        <p className="text-sm text-gray-300">
                          Monthly Reward: <span className="text-primary-400 font-medium">
                            {stats.monthlyReward.toLocaleString()} SHERK
                          </span>
                        </p>
                        <p className="text-sm text-gray-300">
                          52-Week Total: <span className="text-primary-400 font-medium">
                            {stats.total52WeekReward.toLocaleString()} SHERK
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Staking Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sherkStake.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {sherkStake.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-white text-sm">
                        {new Date(sherkStake.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-white text-sm">
                        {new Date(sherkStake.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <GlowButton 
                      onClick={() => navigate('/stake-form')} 
                      variant="outline" 
                      className="w-full"
                    >
                      Update Stake
                    </GlowButton>
                    <GlowButton 
                      onClick={() => navigate('/token')} 
                      variant="outline" 
                      className="w-full"
                    >
                      View Token Info
                    </GlowButton>
                    
                    {/* Temporary manual stake creation - HIDDEN */}
                    {/* <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <h4 className="text-yellow-400 font-semibold mb-2">Manual Stake Creation (Debug)</h4>
                      <p className="text-yellow-300 text-sm mb-3">
                        If the form isn't working, use this to create a test stake manually.
                      </p>
                      <GlowButton 
                        onClick={async () => {
                          try {
                            const result = await supabase
                              .from('sherk_stakes')
                              .insert([{
                                user_id: user.id,
                                nickname: 'Manual Test',
                                wallet_address: 'kaspa:manual-test',
                                common_nfts: 1,
                                rare_nfts: 0,
                                ultra_rare_nfts: 0,
                                boom_nfts: 0,
                                status: 'active'
                              }])
                              .select()
                            
                            if (result.error) {
                              alert(`Error: ${result.error.message}`)
                            } else {
                              alert('Manual stake created successfully!')
                              window.location.reload()
                            }
                          } catch (error) {
                            alert(`Error: ${error.message}`)
                          }
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Create Test Stake
                      </GlowButton>
                    </div> */}
                    
                    {/* Debug Section - HIDDEN */}
                    {/* <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">Debug Information</h4>
                      <div className="text-blue-300 text-sm space-y-2">
                        <p>User ID: {user.id}</p>
                        <p>Loading: {loading ? 'true' : 'false'}</p>
                        <p>Stake Loading: {stakeLoading ? 'true' : 'false'}</p>
                        <p>Has Stake: {sherkStake ? 'Yes' : 'No'}</p>
                        {sherkStake && (
                          <div>
                            <p>Stake ID: {sherkStake.id}</p>
                            <p>Nickname: {sherkStake.nickname}</p>
                            <p>Rare NFTs: {sherkStake.rare_nfts}</p>
                          </div>
                        )}
                      </div>
                      <GlowButton 
                        onClick={() => {
                          console.log('Manual refresh triggered')
                          fetchSherkStake()
                        }}
                        variant="outline"
                        className="w-full mt-3"
                      >
                        Force Refresh Stake Data
                      </GlowButton>
                      
                      <GlowButton 
                        onClick={async () => {
                          console.log('Simple database test...')
                          try {
                            const result = await supabase
                              .from('sherk_stakes')
                              .select('*')
                              .eq('user_id', user.id)
                            
                            console.log('Simple test result:', result)
                            alert(`Found ${result.data?.length || 0} stakes for user. Check console for details.`)
                          } catch (error) {
                            console.error('Simple test error:', error)
                            alert(`Error: ${error.message}`)
                          }
                        }}
                        variant="outline"
                        className="w-full mt-2"
                      >
                        Simple Database Test
                      </GlowButton>
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}