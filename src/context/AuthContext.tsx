import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, signup as signupRequest } from '../services/auth'
import type { User } from '../types'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: 'Admin' | 'Member') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_TOKEN = 'task_manager_token'
const STORAGE_USER = 'task_manager_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_USER)
    return raw ? JSON.parse(raw) as User : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_TOKEN)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_USER)
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await loginRequest(email, password)
      setToken(response.token)
      setUser(response.user)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: 'Admin' | 'Member') => {
    setLoading(true)
    try {
      const response = await signupRequest(name, email, password, role)
      setToken(response.token)
      setUser(response.user)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
