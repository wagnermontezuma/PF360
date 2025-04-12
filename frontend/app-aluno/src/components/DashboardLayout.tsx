import { FC, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiHome, FiActivity, FiCalendar, FiBarChart2, FiBell, FiMenu, FiX } from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: FiHome, label: 'Home', href: '/dashboard' },
    { icon: FiActivity, label: 'Treinos', href: '/dashboard/workouts' },
    { icon: FiCalendar, label: 'Histórico', href: '/dashboard/history' },
    { icon: FiBarChart2, label: 'Evolução', href: '/dashboard/progress' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-600 text-white lg:hidden"
        aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center mb-8 pl-2">
            <img src="/logo.svg" alt="Fitness 360" className="h-8 w-auto" />
            <h1 className="ml-3 text-xl font-semibold text-gray-800">Fitness 360</h1>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400'
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`p-4 lg:ml-64 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => item.href === router.pathname)?.label || 'Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Bem-vindo ao seu painel de controle
              </p>
            </div>
            
            <button
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Notificações"
            >
              <FiBell className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout; 