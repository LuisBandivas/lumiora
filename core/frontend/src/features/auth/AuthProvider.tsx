import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { AuthContext, type AuthContextValue } from './authContext'

function requireClient() {
  if (!supabase) throw new Error('Authentication is not configured. Add the Supabase URL and publishable key to core/frontend/.env.local.')
  return supabase
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return

    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) console.error('Unable to restore the Supabase session.', error)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }).catch((error: unknown) => {
      if (!active) return
      console.error('Unable to restore the Supabase session.', error)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    configured: isSupabaseConfigured,
    async signInWithGoogle() {
      const client = requireClient()
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/login` },
      })
      if (error) throw error
    },
    async signInWithPassword(email, password) {
      const { error } = await requireClient().auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signUp({ email, password, firstName, lastName, username }) {
      const { data, error } = await requireClient().auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName, username },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
      return Boolean(data.session)
    },
    async signOut() {
      const { error } = await requireClient().auth.signOut()
      if (error) throw error
    },
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
