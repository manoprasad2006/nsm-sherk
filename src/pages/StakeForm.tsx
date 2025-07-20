import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/Layout/Navbar'
import { Footer } from '../components/Layout/Footer'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GlowButton } from '../components/UI/GlowButton'
import { Modal } from '../components/UI/Modal'
import { Pickaxe, Wallet, User, CheckCircle, AlertCircle, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState<string | null>(null)
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get the current session's access token
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAccessToken(session?.access_token || null)
    })
  }, [user])

  useEffect(() => {
    if (user) {
      fetchExistingStake()
    }
  }, [user])

  const fetchExistingStake = async () => {
    if (!user) return
    
    console.log('Fetching existing stake for user:', user.id, 'accessToken available:', !!accessToken)
    
    const headers = {
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };
    try {
      console.log('Fetching existing stake for user:', user.id)
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?user_id=eq.${user.id}`, {
        method: 'GET',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Existing stake fetch result:', data)
        
        if (data && data.length > 0) {
          const stake = data[0]
          setExistingStake(stake)
          setStakeData({
            nickname: stake.nickname || '',
            wallet_address: stake.wallet_address || '',
            common_nfts: stake.common_nfts || 0,
            rare_nfts: stake.rare_nfts || 0,
            ultra_rare_nfts: stake.ultra_rare_nfts || 0,
            boom_nfts: stake.boom_nfts || 0
          })
          console.log('Existing stake loaded:', stake)
        } else {
          console.log('No existing stake found')
        }
      } else {
        console.error('Error fetching existing stake:', response.status, response.statusText)
        
        // Fallback: Try using Supabase client
        console.log('Trying fallback with Supabase client...')
        try {
          const { data: supabaseData, error } = await supabase
            .from('sherk_stakes')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (!error && supabaseData) {
            console.log('Fallback successful, existing stake found:', supabaseData)
            setExistingStake(supabaseData)
            setStakeData({
              nickname: supabaseData.nickname || '',
              wallet_address: supabaseData.wallet_address || '',
              common_nfts: supabaseData.common_nfts || 0,
              rare_nfts: supabaseData.rare_nfts || 0,
              ultra_rare_nfts: supabaseData.ultra_rare_nfts || 0,
              boom_nfts: supabaseData.boom_nfts || 0
            })
          } else {
            console.log('No existing stake found via fallback')
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
        }
      }
    } catch (error) {
      console.error('Error fetching existing stake:', error)
    }
  }

  // Check if user has existing stake to determine if fields should be read-only
  const hasExistingStake = existingStake !== null
  
  // Debug logging
  console.log('StakeForm Debug:', {
    user: user?.email,
    accessToken: !!accessToken,
    existingStake: existingStake,
    hasExistingStake: hasExistingStake,
    stakeData: stakeData
  })

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
    
    console.log('=== STAKE FORM SUBMISSION DEBUG ===')
    console.log('Form data:', stakeData)
    console.log('User:', user)
    console.log('Access token available:', !!accessToken)
    
    if (!user) {
      console.log('ERROR: No user found')
      setModalMessage('Please log in to create a stake')
      setModalType('error')
      setShowModal(true)
      return
    }

    // Validate that at least one NFT is selected
    const totalNfts = stakeData.common_nfts + stakeData.rare_nfts + stakeData.ultra_rare_nfts + stakeData.boom_nfts
    console.log('Total NFTs:', totalNfts)
    
    if (totalNfts === 0) {
      console.log('ERROR: No NFTs selected')
      setModalMessage('Please select at least one NFT to stake. You cannot create an empty stake.')
      setModalType('error')
      setShowModal(true)
      return
    }

    setLoading(true)
    setIsSubmitting(true)
    console.log('Starting submission process...')

    try {
      const stakeDataToSubmit = {
        user_id: user.id,
        nickname: stakeData.nickname.trim() || 'Anonymous',
        wallet_address: stakeData.wallet_address.trim() || 'kaspa:anonymous',
        common_nfts: stakeData.common_nfts,
        rare_nfts: stakeData.rare_nfts,
        ultra_rare_nfts: stakeData.ultra_rare_nfts,
        boom_nfts: stakeData.boom_nfts,
        status: 'active',
        updated_at: new Date().toISOString()
      }

      console.log('Prepared data for submission:', stakeDataToSubmit)

      // Use direct REST API with UPSERT instead of Supabase client
      console.log('Using direct REST API with UPSERT...')
      
      const startTime = Date.now()
      
      // Always try POST first for new accounts
      console.log('Attempting POST for new stake...')
      let response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(stakeDataToSubmit)
      })
      
      console.log('POST response status:', response.status)
      console.log('POST response ok:', response.ok)
      
      // If POST fails with conflict (user already has stake), try PATCH
      if (response.status === 409) {
        console.log('User already has stake, attempting PATCH...')
        response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?user_id=eq.${user.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(stakeDataToSubmit)
        })
        console.log('PATCH response status:', response.status)
      }
      
      const endTime = Date.now()
      
      console.log(`REST API call completed in ${endTime - startTime}ms`)
      console.log('Final response status:', response.status)
      console.log('Final response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HTTP Error Response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      let result
      try {
        result = await response.json()
        console.log('REST API response:', result)
      } catch (error) {
        console.log('No JSON response (this is normal for PATCH requests)')
        result = null
      }

      // For PATCH requests (updates), we don't always get data back, but that's OK
      // For POST requests (creates), we should get the created data
      if (response.ok) {
        console.log('SUCCESS! Stake operation completed')
        
        if (result && result.length > 0) {
          console.log('Stake data returned:', result[0])
        } else {
          console.log('No data returned (normal for updates)')
        }
        
        // Verify the stake was actually created by fetching it immediately
        console.log('Verifying stake creation by fetching it...')
        const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?user_id=eq.${user.id}`, {
          method: 'GET',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json()
          console.log('Verification fetch result:', verifyData)
          console.log('Verification fetch result length:', verifyData ? verifyData.length : 'null')
          
          if (verifyData && verifyData.length > 0) {
            console.log('✅ Stake verification successful!')
          } else {
            console.log('❌ Stake verification failed - no data found')
          }
        } else {
          console.error('Verification fetch failed:', verifyResponse.status, verifyResponse.statusText)
        }
        
        setModalMessage('🎉 Stake updated successfully! Redirecting to dashboard...')
        setModalType('success')
        setShowModal(true)
        
        // Clear any old cached data
        localStorage.removeItem(`sherk_stake_${user.id}`)
        
        setTimeout(() => {
          console.log('Redirecting to dashboard after successful submission')
          navigate('/dashboard', { 
            replace: true,
            state: { fromStakeForm: true, timestamp: Date.now() }
          })
        }, 1000) // Reduced from 2000ms to 1000ms
        return
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

    } catch (error) {
      console.error('REST API submission failed:', error)
      
      setModalMessage(`Stake creation failed. Please try again or contact support.

Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setModalType('error')
      setShowModal(true)
      
    } finally {
      console.log('Submission process completed')
      setLoading(false)
      setIsSubmitting(false)
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
            <GlowButton onClick={() => navigate('/auth')}>
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
              {hasExistingStake ? 'Update SHERK NFT Stake' : 'SHERK NFT Staking'}
            </h1>
            <p className="text-xl text-gray-400">
              {hasExistingStake ? 'Update your existing stake' : 'Stake your SHERK NFTs and earn weekly rewards'}
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
                    {hasExistingStake && (
                      <span className="text-sm text-gray-400 ml-2">(Cannot be changed)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={stakeData.nickname}
                    onChange={(e) => !hasExistingStake && handleInputChange('nickname', e.target.value)}
                    className={`w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                      hasExistingStake ? 'opacity-60 cursor-not-allowed bg-gray-800' : ''
                    }`}
                    placeholder={hasExistingStake ? 'Nickname (locked)' : 'Enter your nickname'}
                    required
                    readOnly={hasExistingStake}
                    disabled={hasExistingStake}
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    <Wallet className="inline h-4 w-4 mr-2" />
                    Kaspa Wallet Address *
                    {hasExistingStake && (
                      <span className="text-sm text-gray-400 ml-2">(Cannot be changed)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={stakeData.wallet_address}
                    onChange={(e) => !hasExistingStake && handleInputChange('wallet_address', e.target.value)}
                    className={`w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                      hasExistingStake ? 'opacity-60 cursor-not-allowed bg-gray-800' : ''
                    }`}
                    placeholder={hasExistingStake ? 'Wallet Address (locked)' : 'Enter your Kaspa wallet address'}
                    required
                    readOnly={hasExistingStake}
                    disabled={hasExistingStake}
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
                    disabled={isSubmitting}
                    className="w-full min-w-[200px] bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors glow-on-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {hasExistingStake ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {hasExistingStake ? 'Update Stake' : 'Create Stake'}
                      </>
                    )}
                  </button>
                
                                  {/* Professional retry option */}
                  <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-300 mb-2">
                      Need help? Our support team is here to assist you.
                    </p>
                    <GlowButton 
                      onClick={() => {
                        setModalMessage('For immediate assistance, please contact our support team at support@nsm.com or join our Discord community.')
                        setModalType('success')
                        setShowModal(true)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Contact Support
                    </GlowButton>
                  </div>
                  
                  {/* Network Test Button */}
                  <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-sm text-red-300 mb-2">
                      Debug: Test Supabase Connection
                    </p>
                    <GlowButton 
                      onClick={async () => {
                        try {
                          console.log('=== NETWORK DIAGNOSTIC TEST ===')
                          console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
                          console.log('User ID:', user?.id)
                          
                          // Test 1: Direct fetch to Supabase REST API
                          console.log('Test 1: Direct REST API call...')
                          const startTime = Date.now()
                          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?select=count`, {
                            method: 'GET',
                            headers: {
                              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                              'Content-Type': 'application/json'
                            }
                          })
                          const endTime = Date.now()
                          
                          console.log(`Test 1 completed in ${endTime - startTime}ms`)
                          console.log('Response status:', response.status)
                          console.log('Response ok:', response.ok)
                          
                          if (response.ok) {
                            const data = await response.json()
                            console.log('Test 1 data:', data)
                          } else {
                            console.log('Test 1 failed:', response.statusText)
                          }
                          
                          // Test 2: Direct insert via REST API
                          console.log('Test 2: Direct REST API insert...')
                          const insertResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes`, {
                            method: 'POST',
                            headers: {
                              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                              'Content-Type': 'application/json',
                              'Prefer': 'return=representation'
                            },
                            body: JSON.stringify({
                              user_id: user?.id,
                              nickname: 'NETWORK_TEST',
                              wallet_address: 'kaspa:test',
                              common_nfts: 1,
                              rare_nfts: 0,
                              ultra_rare_nfts: 0,
                              boom_nfts: 0,
                              status: 'active'
                            })
                          })
                          
                          console.log('Test 2 status:', insertResponse.status)
                          console.log('Test 2 ok:', insertResponse.ok)
                          
                          if (insertResponse.ok) {
                            const insertData = await insertResponse.json()
                            console.log('Test 2 success:', insertData)
                            
                            // Clean up test data
                            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?nickname=eq.NETWORK_TEST`, {
                              method: 'DELETE',
                              headers: {
                                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                              }
                            })
                          } else {
                            const errorText = await insertResponse.text()
                            console.log('Test 2 failed:', errorText)
                          }
                          
                          alert(`Network Test Results:

Test 1 (REST API): ${response.ok ? 'PASSED' : 'FAILED'} (${response.status})
Test 2 (Direct Insert): ${insertResponse.ok ? 'PASSED' : 'FAILED'} (${insertResponse.status})

Check console for detailed logs.`)
                          
                        } catch (error) {
                          console.error('Network test failed:', error)
                          alert(`Network test failed: ${error}`)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Test Network Connection
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