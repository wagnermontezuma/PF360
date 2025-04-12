import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  HomeIcon, 
  UserIcon, 
  ClipboardDocumentListIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Treinos',
    href: '/dashboard/workouts',
    icon: ClipboardDocumentListIcon
  },
  {
    name: 'Nutrição',
    href: '/dashboard/nutrition',
    icon: HeartIcon
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: UserIcon
  }
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-lg w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Fitness 360</h1>
      </div>

      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Sair
        </button>
      </div>
    </nav>
  );
} 