'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, FiUser, FiCalendar, FiPieChart, 
  FiMessageSquare, FiSettings, FiLogOut, 
  FiMenu, FiX, FiActivity, FiBarChart2, FiTrendingUp 
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { label: 'Treinos', href: '/dashboard/workouts', icon: <FiActivity /> },
    { label: 'Nutrição', href: '/dashboard/nutrition', icon: <FiPieChart /> },
    { label: 'Progresso', href: '/dashboard/progress', icon: <FiTrendingUp /> },
    { label: 'Estatísticas', href: '/dashboard/stats', icon: <FiBarChart2 /> },
    { label: 'Mensagens', href: '/messages', icon: <FiMessageSquare /> },
    { label: 'Perfil', href: '/profile', icon: <FiUser /> },
    { label: 'Configurações', href: '/settings', icon: <FiSettings /> },
  ];
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="w-64 bg-[#1A1A1A] p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Fitness <span className="text-text">360°</span>
          </h1>
        </div>
        
        <nav className="mb-10">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.href}>
                  <Link href={item.href} legacyBehavior>
                    <a 
                      className={`flex items-center p-3 rounded-xl group transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-light hover:bg-[#222222] hover:text-text'
                      }`}
                    >
                      <span className="w-5 h-5 mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="pt-6 mt-6 border-t border-[#2A2A2A]">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium mr-3">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-text font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-gray-light text-sm">{user?.email || 'usuario@email.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center p-3 w-full text-left rounded-xl text-gray-light hover:bg-[#222222] hover:text-text group transition-colors"
          >
            <span className="w-5 h-5 mr-3 text-error"><FiLogOut /></span>
            <span>Sair</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden bg-[#1A1A1A] p-4 flex justify-between items-center border-b border-[#2A2A2A]">
          <h1 className="text-xl font-bold text-primary">
            Fitness <span className="text-text">360°</span>
          </h1>
          
          <button 
            className="text-gray-light hover:text-text p-1"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </header>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-background z-50 pt-16">
            <div className="p-4">
              <nav className="mb-6">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                    
                    return (
                      <li key={item.href}>
                        <Link href={item.href} legacyBehavior>
                          <a 
                            className={`flex items-center p-3 rounded-xl group transition-colors ${
                              isActive 
                                ? 'bg-primary text-white' 
                                : 'text-gray-light hover:bg-[#222222] hover:text-text'
                            }`}
                            onClick={toggleMobileMenu}
                          >
                            <span className="w-5 h-5 mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              
              <div className="pt-6 mt-6 border-t border-[#2A2A2A]">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium mr-3">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-text font-medium">{user?.name || 'Usuário'}</p>
                    <p className="text-gray-light text-sm">{user?.email || 'usuario@email.com'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 w-full text-left rounded-xl text-gray-light hover:bg-[#222222] hover:text-text group transition-colors"
                >
                  <span className="w-5 h-5 mr-3 text-error"><FiLogOut /></span>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 