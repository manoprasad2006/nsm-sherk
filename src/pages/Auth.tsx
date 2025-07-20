import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, UserPlus, Mail, Lock, MessageCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { GlowButton } from '../components/UI/GlowButton'
import { ParticleBackground } from '../components/UI/ParticleBackground'
import toast, { Toaster } from 'react-hot-toast'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telegram, setTelegram] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        console.log('Attempting sign in...')
        const { data, error } = await signIn(email, password)
        console.log('Sign in result:', { data, error })
        
        if (error) {
          toast.error(error.message)
          setLoading(false)
        } else {
          toast.success('Welcome back!')
          setTimeout(() => {
            navigate('/dashboard')
          }, 100)
        }
      } else {
        const { error } = await signUp(email, password, telegram)
        if (error) {
          toast.error(error.message)
          setLoading(false)
        } else {
          toast.success('Account created successfully!')
          setTimeout(() => {
            navigate('/dashboard')
          }, 100)
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      <Toaster position="top-center" />
      
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {isLogin ? <LogIn className="h-8 w-8 text-primary-400" /> : <UserPlus className="h-8 w-8 text-primary-400" />}
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join $SHERK'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to access your dashboard' : 'Create your account to start staking'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telegram Username (Optional)
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="@username"
                  />
                </div>
              </div>
            )}

            <GlowButton
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </GlowButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}