'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingOverlay from './LoadingOverlay';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  return (
    <div className="flex h-full">
      {isLoading && <LoadingOverlay />}

      {/* Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <Header />
        
        {/* Conteúdo da página */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 