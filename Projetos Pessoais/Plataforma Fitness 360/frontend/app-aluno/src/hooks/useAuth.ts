'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

const API_URL = 'http://localhost:3001';
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ1c3VhcmlvQGVtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const MOCK_USER = {
  id: '1234567890',
  email: 'usuario@email.com',
  name: 'Usuário Teste',
  role: 'ADMIN',
  token: MOCK_TOKEN
};

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Verificando autenticação...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setState(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
        return;
      }

      // Simulando verificação de token
      console.log('Token encontrado, simulando autenticação');
      setState({
        user: { ...MOCK_USER, token },
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      router.push('/login');
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Iniciando tentativa de login com:', email, password);
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Verificar credenciais (case-insensitive para email)
      if (email.toLowerCase() === 'usuario@email.com' && password === 'senha123') {
        console.log('Credenciais válidas, simulando login com sucesso');
        
        // Simulando resposta do backend
        localStorage.setItem('token', MOCK_TOKEN);
        
        const userWithToken = {
          ...MOCK_USER,
          token: MOCK_TOKEN
        };
        
        setState({
          user: userWithToken,
          isAuthenticated: true,
          isLoading: false
        });

        // Adicionando um pequeno atraso para simular o processo de autenticação
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        console.error('Credenciais inválidas:', email, password);
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Erro ao fazer login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    router.push('/login');
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
  };
} 