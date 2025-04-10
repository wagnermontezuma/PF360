'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingOverlay from './LoadingOverlay';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Não renderizar nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return null;
  }

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Fitness 360 - Portal do Profissional
        </footer>
      </div>
    </div>
  );
} 