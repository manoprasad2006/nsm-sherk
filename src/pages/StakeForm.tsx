import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/Layout/Navbar'
import { Footer } from '../components/Layout/Footer'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GlowButton } from '../components/UI/GlowButton'
import { Modal } from '../components/UI/Modal'
import { Pickaxe, Wallet, User, CheckCircle, AlertCircle } from 'lucide-react'

interface StakeData {
  nickname: string
  wallet_address: string
  common_nfts: number
  rare_nfts: number
  ultra_rare_nfts: number
  boom_nfts: number
}

export function StakeForm() {
  const { user } = useAuth()
  const [stakeData, setStakeData] = useState<StakeData>({
    nickname: '',
    wallet_address: '',
    common_nfts: 0,
    rare_nfts: 0,
    ultra_rare_nfts: 0,
    boom_nfts: 0
  })
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalType, setModalType] = useState<'success' | 'error'>('success')
  const [existingStake, setExistingStake] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchExistingStake()
    }
  }, [user])

  const fetchExistingStake = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('sherk_stakes')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching stake:', error)
        return
      }

      if (data) {
        setExistingStake(data)
        setStakeData({
          nickname: data.nickname || '',
          wallet_address: data.wallet_address || '',
          common_nfts: data.common_nfts || 0,
          rare_nfts: data.rare_nfts || 0,
          ultra_rare_nfts: data.ultra_rare_nfts || 0,
          boom_nfts: data.boom_nfts || 0
        })
      }
    } catch (error) {
      console.error('Error fetching existing stake:', error)
    }
  }

  const calculatePickaxes = () => {
    return stakeData.common_nfts * 1 + 
           stakeData.rare_nfts * 2 + 
           stakeData.ultra_rare_nfts * 3 + 
           stakeData.boom_nfts * 4
  }

  const calculateWeeklyReward = () => {
    return calculatePickaxes() * 1562
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setModalMessage('User not authenticated')
      setModalType('error')
      setShowModal(true)
      return
    }

    if (calculatePickaxes() === 0) {
      setModalMessage('Please add at least one NFT to stake')
      setModalType('error')
      setShowModal(true)
      return
    }

    setLoading(true)
    console.log('Starting stake submission...', { user: user.id, stakeData })

    const stakeDataToSave = {
      user_id: user.id,
      nickname: stakeData.nickname.trim(),
      wallet_address: stakeData.wallet_address.trim(),
      common_nfts: stakeData.common_nfts,
      rare_nfts: stakeData.rare_nfts,
      ultra_rare_nfts: stakeData.ultra_rare_nfts,
      boom_nfts: stakeData.boom_nfts,
      status: 'active'
    }

    // Store in localStorage as backup
    localStorage.setItem('pendingStakeData', JSON.stringify(stakeDataToSave))
    
    console.log('Attempting database insertion with data:', stakeDataToSave)

    // Try multiple database insertion approaches
    let success = false
    let errorMessage = ''

    // Approach 1: Direct insert
    try {
      console.log('Trying direct insert...')
      const insertResult = await supabase
        .from('sherk_stakes')
        .insert([stakeDataToSave])
        .select()

      console.log('Direct insert result:', insertResult)

      if (insertResult.data && insertResult.data.length > 0) {
        success = true
        console.log('Direct insert successful!')
      } else if (insertResult.error) {
        errorMessage = `Direct insert failed: ${insertResult.error.message}`
        console.error('Direct insert error:', insertResult.error)
      }
    } catch (error) {
      errorMessage = `Direct insert error: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error('Direct insert exception:', error)
    }

    // Approach 2: Upsert if direct insert failed
    if (!success) {
      try {
        console.log('Trying upsert approach...')
        const upsertResult = await supabase
          .from('sherk_stakes')
          .upsert([stakeDataToSave], {
            onConflict: 'user_id'
          })
          .select()

        console.log('Upsert result:', upsertResult)

        if (upsertResult.data && upsertResult.data.length > 0) {
          success = true
          console.log('Upsert successful!')
        } else if (upsertResult.error) {
          errorMessage = `Upsert failed: ${upsertResult.error.message}`
          console.error('Upsert error:', upsertResult.error)
        }
      } catch (error) {
        errorMessage = `Upsert error: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error('Upsert exception:', error)
      }
    }

    // Approach 3: Delete then insert if upsert failed
    if (!success) {
      try {
        console.log('Trying delete then insert approach...')
        
        // First delete any existing stake
        const deleteResult = await supabase
          .from('sherk_stakes')
          .delete()
          .eq('user_id', user.id)
        
        console.log('Delete result:', deleteResult)
        
        // Then insert new stake
        const insertResult = await supabase
          .from('sherk_stakes')
          .insert([stakeDataToSave])
          .select()

        console.log('Delete-then-insert result:', insertResult)

        if (insertResult.data && insertResult.data.length > 0) {
          success = true
          console.log('Delete-then-insert successful!')
        } else if (insertResult.error) {
          errorMessage = `Delete-then-insert failed: ${insertResult.error.message}`
          console.error('Delete-then-insert error:', insertResult.error)
        }
      } catch (error) {
        errorMessage = `Delete-then-insert error: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error('Delete-then-insert exception:', error)
      }
    }

    setLoading(false)

    if (success) {
      // Clear stored data since we succeeded
      localStorage.removeItem('pendingStakeData')
      
      setModalMessage('🎉 Your stake has been successfully saved to the database! The admin can now see your stake. Redirecting to dashboard...')
      setModalType('success')
      setShowModal(true)
      
      // Update local state
      setExistingStake(stakeDataToSave)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } else {
      setModalMessage(`Database insertion failed after trying multiple approaches. 

Error: ${errorMessage}

Your data has been saved locally. Please try the manual backup button below, or contact support with this data:

${JSON.stringify(stakeDataToSave, null, 2)}`)
      setModalType('error')
      setShowModal(true)
    }
  }

  const handleInputChange = (field: keyof StakeData, value: string | number) => {
    setStakeData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nftTypes = [
    { name: 'common_nfts', label: 'Common NFTs', pickaxes: 1, reward: 1562, color: 'primary' },
    { name: 'rare_nfts', label: 'Rare NFTs', pickaxes: 2, reward: 3124, color: 'yellow' },
    { name: 'ultra_rare_nfts', label: 'Ultra Rare NFTs', pickaxes: 3, reward: 4686, color: 'purple' },
    { name: 'boom_nfts', label: 'BOOM NFTs', pickaxes: 4, reward: 6248, color: 'red' }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900">
        <ParticleBackground />
        <Navbar variant="token" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please log in to access the staking form</p>
            <GlowButton onClick={() => window.location.href = '/auth'}>
              Go to Login
            </GlowButton>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <ParticleBackground />
      <Navbar variant="token" />
      
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-heading font-bold text-white mb-4">
              SHERK NFT Staking
            </h1>
            <p className="text-xl text-gray-400">
              Stake your SHERK NFTs and earn weekly rewards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 border border-primary-500/30 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Nickname *
                  </label>
                  <input
                    type="text"
                    value={stakeData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter your nickname"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    <Wallet className="inline h-4 w-4 mr-2" />
                    Kaspa Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={stakeData.wallet_address}
                    onChange={(e) => handleInputChange('wallet_address', e.target.value)}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter your Kaspa wallet address"
                    required
                  />
                </div>
              </div>

              {/* NFT Counts */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6">NFT Collection</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {nftTypes.map((nftType) => (
                    <div key={nftType.name} className="bg-dark-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{nftType.label}</h4>
                        <div className="flex items-center text-sm text-gray-400">
                          <Pickaxe className="h-4 w-4 mr-1" />
                          {nftType.pickaxes} pickaxe{nftType.pickaxes > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          min="0"
                          value={stakeData[nftType.name as keyof StakeData]}
                          onChange={(e) => handleInputChange(nftType.name as keyof StakeData, parseInt(e.target.value) || 0)}
                          className="flex-1 bg-dark-600 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                        <div className="text-sm text-gray-400">
                          {nftType.reward.toLocaleString()} SHERK/week
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-dark-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Staking Summary</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-400 mb-2">
                      {calculatePickaxes()}
                    </div>
                    <div className="text-gray-400">Total Pickaxes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-400 mb-2">
                      {calculateWeeklyReward().toLocaleString()}
                    </div>
                    <div className="text-gray-400">Weekly Reward (SHERK)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-400 mb-2">
                      {(calculateWeeklyReward() * 52).toLocaleString()}
                    </div>
                    <div className="text-gray-400">Total 52-Week Reward</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button 
                  type="submit"
                  disabled={loading}
                  className="min-w-[200px] bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors glow-on-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {existingStake ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {existingStake ? 'Update Stake' : 'Create Stake'}
                    </div>
                  )}
                </button>
                
                {/* Backup Manual Creation */}
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">Backup: Manual Stake Creation</h4>
                  <p className="text-yellow-300 text-sm mb-3">
                    If the form above doesn't work, use this button to create a test stake with your current form data.
                  </p>
                  <GlowButton 
                    onClick={async () => {
                      try {
                        // Get stored data or use current form data
                        const storedData = localStorage.getItem('pendingStakeData')
                        const dataToUse = storedData ? JSON.parse(storedData) : {
                          user_id: user.id,
                          nickname: stakeData.nickname.trim() || 'Manual Test',
                          wallet_address: stakeData.wallet_address.trim() || 'kaspa:manual-test',
                          common_nfts: stakeData.common_nfts,
                          rare_nfts: stakeData.rare_nfts,
                          ultra_rare_nfts: stakeData.ultra_rare_nfts,
                          boom_nfts: stakeData.boom_nfts,
                          status: 'active'
                        }
                        
                        console.log('Manual stake creation with data:', dataToUse)
                        
                        // Try multiple approaches
                        let result = null
                        let error = null
                        
                        // Approach 1: Direct insert
                        try {
                          result = await supabase
                            .from('sherk_stakes')
                            .insert([dataToUse])
                            .select()
                          console.log('Direct insert result:', result)
                        } catch (e) {
                          console.log('Direct insert failed, trying upsert...')
                          error = e
                        }
                        
                        // Approach 2: Upsert if insert failed
                        if (!result || result.error) {
                          try {
                            result = await supabase
                              .from('sherk_stakes')
                              .upsert([dataToUse], {
                                onConflict: 'user_id'
                              })
                              .select()
                            console.log('Upsert result:', result)
                          } catch (e) {
                            console.log('Upsert also failed:', e)
                            error = e
                          }
                        }
                        
                        if (result && !result.error) {
                          // Clear stored data
                          localStorage.removeItem('pendingStakeData')
                          
                          setModalMessage('Manual stake created successfully! Redirecting to dashboard...')
                          setModalType('success')
                          setShowModal(true)
                          setTimeout(() => {
                            window.location.href = '/dashboard'
                          }, 2000)
                        } else {
                          const errorMsg = error && typeof error === 'object' && 'message' in error 
                            ? (error as any).message 
                            : result?.error?.message || 'Unknown error'
                          setModalMessage(`Manual creation failed. Error: ${errorMsg}. Try the dashboard manual creation instead.`)
                          setModalType('error')
                          setShowModal(true)
                        }
                      } catch (error) {
                        setModalMessage(`Manual creation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
                        setModalType('error')
                        setShowModal(true)
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Create Stake Manually (Backup)
                  </GlowButton>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <Modal 
        open={showModal} 
        onClose={() => setShowModal(false)}
      >
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            modalType === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {modalType === 'success' ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            {modalType === 'success' ? 'Success' : 'Error'}
          </h3>
          <p className="text-white mb-6">{modalMessage}</p>
          <GlowButton onClick={() => setShowModal(false)}>
            Close
          </GlowButton>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}