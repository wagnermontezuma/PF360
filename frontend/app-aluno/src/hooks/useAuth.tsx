import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/router'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
  two_factor_enabled: boolean
}

interface SignInResponse {
  requires2FA: boolean
}

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<SignInResponse>
  verify2FA: (code: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tempToken, setTempToken] = useState<string | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      
      if (response.data.two_factor_required) {
        setTempToken(response.data.temp_token)
        return { requires2FA: true }
      }

      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
      return { requires2FA: false }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      throw error
    }
  }

  const verify2FA = async (code: string) => {
    if (!tempToken) throw new Error('Sessão expirada')

    try {
      const response = await axios.post('/api/auth/2fa/verify', { 
        code,
        token: tempToken 
      })

      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setTempToken(null)
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Código inválido'
      toast.error(message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await axios.post('/api/auth/logout', null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      signIn,
      verify2FA,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
} 