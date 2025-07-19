import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast, { Toaster } from 'react-hot-toast'

interface NavbarProps {
  variant?: 'giveaways' | 'token'
}

export function Navbar({ variant = 'giveaways' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userProfile, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const giveawaysLinks = [
    { to: '/giveaways', label: 'Home' },
    { to: '/giveaways#about', label: 'About' },
    { to: '/giveaways#giveaways', label: 'Ongoing Giveaways' },
    { to: '/giveaways#history', label: 'History' },
    { to: '/giveaways#testimonial', label: 'Testimonial' },
    { to: '/giveaways#faq', label: 'FAQ' },
    { to: '/giveaways#contact', label: 'Contact' },
  ]

  const tokenLinks = [
    { to: '/token', label: 'Home' },
    { to: '/token#tokenomics', label: 'Tokenomics' },
    { to: '/token#roadmap', label: 'Roadmap' },
    { to: '/token#nft-utility', label: 'NFT Utility' },
    { to: '/token#community', label: 'Community' },
    { to: '/token#donate', label: 'Donate' },
  ]

  const links = variant === 'giveaways' ? giveawaysLinks : tokenLinks

  // Helper to handle hash links
  const handleNavClick = (e: React.MouseEvent, to: string) => {
    const [path, hash] = to.split('#')
    if (hash && location.pathname === path) {
      e.preventDefault()
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      setIsOpen(false)
    } else if (!hash && location.pathname === path) {
      // If clicking Home and already on the page, scroll to top
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    if (signingOut) return // Prevent multiple clicks
    
    setSigningOut(true)
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-primary-500/20' 
          : 'bg-transparent'
      }`}
    >
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={variant === 'token' ? '/tiger3.jpg' : '/ttlogo.jpg'}
              alt={variant === 'token' ? 'NSM Tiger Logo' : 'NSM Logo'}
              className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-primary-500"
            />
            <span className="text-2xl font-bold text-white font-heading tracking-tight">NSM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
              const [path, hash] = link.to.split('#')
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative text-gray-300 hover:text-primary-500 transition-colors font-medium"
                  onClick={e => handleNavClick(e, link.to)}
                >
                  {link.label}
                  {location.pathname === path && location.hash === `#${hash}` && (
                    <motion.div
                      layoutId="activeLink"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500"
                    />
                  )}
                </Link>
              )
            })}
            
            {variant === 'token' && user && (
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-primary-500 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
            
            {variant === 'token' && userProfile?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-primary-500 transition-colors font-medium"
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white text-sm transition-colors"
                >
                  {signingOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg text-white font-medium transition-colors glow-on-hover"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800/95 backdrop-blur-md rounded-lg mt-2 p-4"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-gray-300 hover:text-primary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
                disabled={signingOut}
                className="block w-full text-left py-2 text-red-400 hover:text-red-300 disabled:text-red-600 disabled:cursor-not-allowed transition-colors"
              >
                {signingOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            ) : (
              <Link
                to="/auth"
                className="block py-2 text-primary-500 hover:text-primary-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}