'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Verificar se está carregando para evitar redirecionamento prematuro
  if (!isLoading && !isAuthenticated) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
} 