'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Valores padrão do contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Hook personalizado para acessar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se existe um token ao carregar a página
  useEffect(() => {
    const loadStoredUser = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Decodificar o token para obter os dados do usuário
          const decoded: any = jwtDecode(storedToken);
          
          // Verificar se o token expirou
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token expirado
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            router.push('/login');
            return;
          }
          
          // Configurar o token no cabeçalho padrão do axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          setToken(storedToken);
          setUser({
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
          });
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };

    loadStoredUser();
  }, [router]);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`, {
        email,
        password,
      });

      const { accessToken } = response.data;
      
      // Salvar o token no localStorage
      localStorage.setItem('token', accessToken);
      
      // Configurar o token no cabeçalho padrão do axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Decodificar o token para obter os dados do usuário
      const decoded: any = jwtDecode(accessToken);
      
      setToken(accessToken);
      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      });
      
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
    toast.success('Logout realizado com sucesso!');
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 