import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, Download, Edit, Trash2, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, MiningRig } from '../lib/supabase'
import { GlowButton } from '../components/UI/GlowButton'
import { Navbar } from '../components/Layout/Navbar'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import toast, { Toaster } from 'react-hot-toast'

export function Admin() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [miningRigs, setMiningRigs] = useState<MiningRig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (!userProfile || userProfile.role !== 'admin') {
      toast.error('Access denied: Admin privileges required')
      navigate('/token')
      return
    }

    fetchMiningRigs()
  }, [user, userProfile, navigate])

  const fetchMiningRigs = async () => {
    try {
      const { data, error } = await supabase
        .from('mining_rigs')
        .select(`
          *,
          users (
            email,
            telegram
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to fetch mining rigs')
        console.error(error)
      } else {
        setMiningRigs(data || [])
      }
    } catch (error) {
      toast.error('Failed to fetch mining rigs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCsv = () => {
    const headers = ['Email', 'Wallet Address', 'Rig Name', 'Rare NFTs', 'Common NFTs', 'Total Slots', 'Telegram', 'Created At']
    const csvData = miningRigs.map(rig => [
      (rig as any).users?.email || 'N/A',
      rig.wallet_address,
      rig.rig_name,
      rig.rare_nfts,
      rig.common_nfts,
      (rig.rare_nfts * 2) + (rig.common_nfts * 0.5),
      rig.telegram_id,
      new Date(rig.created_at || '').toLocaleDateString()
    ])

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `sherk-staking-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('CSV exported successfully!')
  }

  const deleteRig = async (rigId: string) => {
    if (!window.confirm('Are you sure you want to delete this staking record?')) {
      return
    }

    try {
      const { error } = await supabase
        
        .from('mining_rigs')
        .delete()
        .eq('id', rigId)

      if (error) {
        toast.error('Failed to delete record')
        console.error(error)
      } else {
        toast.success('Record deleted successfully')
        fetchMiningRigs()
      }
    } catch (error) {
      toast.error('Failed to delete record')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const totalUsers = miningRigs.length
  const totalSlots = miningRigs.reduce((sum, rig) => sum + (rig.rare_nfts * 2) + (rig.common_nfts * 0.5), 0)
  const totalRareNfts = miningRigs.reduce((sum, rig) => sum + rig.rare_nfts, 0)
  const totalCommonNfts = miningRigs.reduce((sum, rig) => sum + rig.common_nfts, 0)

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
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-white">
                  Admin Panel
                </h1>
                <p className="text-gray-400">
                  Manage $SHERK staking records and user data
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{totalUsers}</p>
                    <p className="text-sm text-gray-400">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-primary-400 font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalSlots}</p>
                    <p className="text-sm text-gray-400">Total Slots</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-sm">R</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalRareNfts}</p>
                    <p className="text-sm text-gray-400">Rare NFTs</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 font-bold text-sm">C</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalCommonNfts}</p>
                    <p className="text-sm text-gray-400">Common NFTs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Staking Records</h2>
              <GlowButton onClick={exportToCsv} variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export CSV
              </GlowButton>
            </div>
          </motion.div>

          {/* Records Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      NFTs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Slots
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {miningRigs.map((rig, index) => (
                    <motion.tr
                      key={rig.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-dark-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {(rig as any).users?.email || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {rig.telegram_id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-white font-mono">
                          {rig.wallet_address.slice(0, 20)}...
                        </p>
                        <p className="text-sm text-gray-400">
                          {rig.rig_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-yellow-400">
                              {rig.rare_nfts}
                            </p>
                            <p className="text-xs text-gray-400">Rare</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-primary-400">
                              {rig.common_nfts}
                            </p>
                            <p className="text-xs text-gray-400">Common</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-white">
                          {(rig.rare_nfts * 2) + (rig.common_nfts * 0.5)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-white">
                          {new Date(rig.created_at || '').toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toast('Edit functionality coming soon')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toast('Reward functionality coming soon')}
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteRig(rig.id!)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {miningRigs.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No staking records found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}