'use client';

import { useState } from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de busca
    console.log('Buscar por:', searchTerm);
  };

  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-gray-800">Portal do Profissional</h1>
      </div>

      {/* Formulário de busca */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <div className="pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar aluno..."
              className="w-full py-2 px-3 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 hover:bg-primary-700 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Notificações e perfil */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <div className="relative">
          <button
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Notificações"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Perfil */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Profissional'}</p>
          </div>
        </div>
      </div>
    </header>
  );
} 