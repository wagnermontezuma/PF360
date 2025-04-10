'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('usuario@email.com');
  const [password, setPassword] = useState('senha123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSubmitCount(prev => prev + 1);

    try {
      console.log(`Tentativa de login #${submitCount + 1}: ${email} / ${password}`);
      
      if (!email.trim() || !password.trim()) {
        throw new Error('Por favor, preencha todos os campos');
      }
      
      // Limpar o localStorage antes de tentar fazer login
      localStorage.removeItem('token');
      
      await login(email, password);
      console.log('Login bem-sucedido!');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err instanceof Error ? err.message : 'Falha ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCredentials = () => {
    setEmail('usuario@email.com');
    setPassword('senha123');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="text-primary">Fitness</span>
          <span className="text-text">360°</span>
        </h1>
        <p className="text-gray-light mt-2 text-lg">Tecnologia, movimento e resultado.</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md bg-[#1A1A1A] rounded-2xl shadow-xl overflow-hidden border border-[#2A2A2A]"
      >
        <div className="py-8 px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-text">Entrar na plataforma</h2>
            <p className="text-gray-light mt-1">Acesse sua conta para continuar</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-light mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-light" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input pl-10 w-full bg-[#1F1F1F] text-text placeholder-gray-light px-4 py-3 rounded-xl border border-[#2A2A2A] focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                  placeholder="Seu email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-light mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-light" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input pl-10 w-full bg-[#1F1F1F] text-text placeholder-gray-light px-4 py-3 rounded-xl border border-[#2A2A2A] focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                  placeholder="Sua senha"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Entrar
                    <FiArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-light">
              Credenciais para teste:{' '}
              <button 
                onClick={handleTestCredentials}
                className="font-medium text-primary hover:text-primary/80 focus:outline-none"
              >
                usuario@email.com / senha123
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center">
            <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 