import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextData {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('@Fitness360:token')
    
    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`
      
      api.get('/auth/user-profile')
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem('@Fitness360:token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem('@Fitness360:token', token)
      api.defaults.headers.authorization = `Bearer ${token}`

      setUser(user)
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      toast.error('Email ou senha incorretos')
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('@Fitness360:token')
      api.defaults.headers.authorization = ''
      setUser(null)
      toast.success('Logout realizado com sucesso!')
    } catch {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 