import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, telegram?: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthContext: Initializing authentication...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthContext: Initial session check:', { session: !!session, user: session?.user?.email, error })
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('AuthContext: User found in session, fetching profile...')
        fetchUserProfile(session.user.id)
      } else {
        console.log('AuthContext: No user in session')
      }
      setLoading(false)
      console.log('AuthContext: Initial loading set to false')
    }).catch(error => {
      console.error('AuthContext: Error getting initial session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state change event:', event, 'user:', session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('AuthContext: User authenticated, fetching profile...')
        await fetchUserProfile(session.user.id)
      } else {
        console.log('AuthContext: User signed out, clearing profile')
        setUserProfile(null)
      }
      setLoading(false)
      console.log('AuthContext: Auth state change complete, loading set to false')
    })

    return () => {
      console.log('AuthContext: Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (!error && data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting sign in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('AuthContext: Sign in result:', { data, error })
      
      if (!error && data.user) {
        // Manually set the user state to ensure immediate update
        setUser(data.user)
        // Fetch user profile
        await fetchUserProfile(data.user.id)
        // Ensure loading is set to false
        setLoading(false)
        console.log('AuthContext: Sign in successful, loading set to false')
      }
      
      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      setLoading(false)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, telegram?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (data.user && !error) {
      // Upsert user profile to avoid duplicate key error
      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        telegram,
        role: 'user'
      })
    }
    
    return { data, error }
  }

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      
      // Clear local state immediately
      setUser(null)
      setUserProfile(null)
      setLoading(false)
      
      console.log('AuthContext: Sign out successful')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Still clear local state even if there's an error
      setUser(null)
      setUserProfile(null)
      setLoading(false)
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}