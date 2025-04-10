'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Squares2X2Icon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CakeIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
    { name: 'Alunos', href: '/alunos', icon: UserGroupIcon },
    { name: 'Treinos', href: '/treinos', icon: ClipboardDocumentListIcon },
    { name: 'Nutrição', href: '/nutricao', icon: CakeIcon },
    { name: 'Análise', href: '/analise', icon: ChartBarIcon },
    { name: 'Comunicação', href: '/comunicacao', icon: ChatBubbleLeftRightIcon },
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <aside
      className={`bg-primary-800 text-white transition-all duration-300 ease-in-out fixed top-0 left-0 h-full z-40 ${
        expanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-primary-700">
          {expanded && (
            <span className="text-lg font-semibold">Fitness 360</span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-primary-700 focus:outline-none"
            aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
          >
            <svg
              className={`h-6 w-6 transform transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={expanded ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
              />
            </svg>
          </button>
        </div>

        {/* User info */}
        {expanded && (
          <div className="px-4 py-4 border-b border-primary-700">
            <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-primary-300 truncate">
              {user?.email || 'email@exemplo.com'}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-900 text-white'
                        : 'text-primary-100 hover:bg-primary-700'
                    } ${!expanded ? 'justify-center' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                    {expanded && (
                      <span className="ml-3 text-sm">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-primary-700">
          <button
            onClick={logout}
            className={`flex items-center px-3 py-2 text-primary-100 hover:bg-primary-700 rounded-md transition-colors w-full ${
              !expanded ? 'justify-center' : ''
            }`}
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
            {expanded && <span className="ml-3 text-sm">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
} 