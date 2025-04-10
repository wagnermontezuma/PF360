'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { FiUser, FiHome, FiActivity, FiPieChart, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import { AuthGuard } from './AuthGuard';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <FiHome className="h-5 w-5" /> },
    { label: 'Treinos', href: '/treinos', icon: <FiActivity className="h-5 w-5" /> },
    { label: 'Nutrição', href: '/dashboard/nutrition', icon: <FiPieChart className="h-5 w-5" /> },
    { label: 'Mensagens', href: '/feedback', icon: <FiMessageSquare className="h-5 w-5" /> },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <nav className="bg-[#1A1A1A] border-b border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/dashboard" className="text-xl font-bold">
                <span className="text-primary">Fitness</span>
                <span className="text-text">360°</span>
              </Link>

              {/* Menu */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="flex items-center gap-2 text-gray-light hover:text-text transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Perfil */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-text">{user?.name || 'Usuário'}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-light hover:text-error rounded-full transition-colors"
                  aria-label="Sair"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile navigation */}
        <div className="bg-[#1A1A1A] md:hidden px-4 py-3 flex items-center justify-between border-b border-[#2A2A2A]">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex flex-col items-center gap-1 text-gray-light hover:text-text transition-colors p-2"
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          <Link 
            href="/profile" 
            className="flex flex-col items-center gap-1 text-gray-light hover:text-text transition-colors p-2"
          >
            <FiUser className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>

        {/* Conteúdo */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
} 