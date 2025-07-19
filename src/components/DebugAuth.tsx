import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function DebugAuth() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [stakeTest, setStakeTest] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        console.log('DebugAuth: Session check result:', { data, error })
        setSessionInfo(data)
        if (error) setError(error.message)
      } catch (err) {
        console.error('DebugAuth: Error checking session:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    checkSession()
  }, [])

  const testStakeAccess = async () => {
    if (!user) return
    
    try {
      console.log('Testing stake access for user:', user.id)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/sherk_stakes?user_id=eq.${user.id}`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Stake test result:', { status: response.status, data })
      setStakeTest({ status: response.status, data })
    } catch (err) {
      console.error('Stake test error:', err)
      setStakeTest({ error: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>User: {user ? user.email : 'null'}</div>
        <div>Session: {sessionInfo?.session ? 'exists' : 'null'}</div>
        {error && <div className="text-red-400">Error: {error}</div>}
        <button 
          onClick={testStakeAccess}
          className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Test Stake Access
        </button>
        {stakeTest && (
          <div className="mt-2 text-xs">
            <div>Test Status: {stakeTest.status}</div>
            <div>Test Data: {stakeTest.data ? JSON.stringify(stakeTest.data).substring(0, 50) + '...' : 'null'}</div>
          </div>
        )}
      </div>
    </div>
  )
} 