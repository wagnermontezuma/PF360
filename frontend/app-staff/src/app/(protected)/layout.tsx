'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirecionar para página de login se não estiver autenticado e não estiver carregando
  if (!isLoading && !isAuthenticated) {
    redirect('/login');
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
} 