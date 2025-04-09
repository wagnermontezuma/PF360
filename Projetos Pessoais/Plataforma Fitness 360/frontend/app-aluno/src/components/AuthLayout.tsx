'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { AuthGuard } from './AuthGuard';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#121212]">
        {/* Navbar */}
        <nav className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/dashboard" className="text-xl font-bold text-blue-500">
                FITNESS 360°
              </Link>

              {/* Menu */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/treinos" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Treinos
                </Link>
                <Link 
                  href="/feedback" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Feedback
                </Link>
              </div>

              {/* Perfil */}
              <div className="flex items-center gap-4">
                <span className="text-gray-300">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Conteúdo */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
} 