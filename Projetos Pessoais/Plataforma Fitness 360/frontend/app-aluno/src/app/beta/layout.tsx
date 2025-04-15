'use client';

import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthLayout } from '@/components/AuthLayout';

export default function BetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { flags, isLoading } = useFeatureFlags();
  const router = useRouter();
  
  // Verifica se o usuário tem acesso a recursos beta
  // Se não tiver, redireciona para o dashboard
  useEffect(() => {
    if (!isLoading && !flags.betaFeedback) {
      router.replace('/dashboard');
    }
  }, [flags.betaFeedback, isLoading, router]);
  
  // Se ainda está carregando as flags, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }
  
  // Se não tem acesso beta, não renderiza nada (aguardando o redirecionamento)
  if (!flags.betaFeedback) {
    return null;
  }
  
  // Se tem acesso, renderiza o conteúdo
  return (
    <AuthLayout>
      <div className="relative">
        <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-bl-md">
          BETA
        </div>
        {children}
      </div>
    </AuthLayout>
  );
} 