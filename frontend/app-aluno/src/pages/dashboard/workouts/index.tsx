import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import DashboardLayout from '../../../components/DashboardLayout';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time: number;
}

interface Workout {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
}

// Dados mockados para desenvolvimento
const mockWorkouts: Workout[] = [
  {
    id: 1,
    name: 'Treino A - Superior',
    description: 'Foco em peito, ombros e tríceps',
    exercises: [
      { id: 1, name: 'Supino Reto', sets: 3, reps: 12, weight: 20, rest_time: 60 },
      { id: 2, name: 'Desenvolvimento', sets: 3, reps: 12, weight: 15, rest_time: 60 },
      { id: 3, name: 'Extensão de Tríceps', sets: 3, reps: 15, weight: 25, rest_time: 45 }
    ]
  },
  {
    id: 2,
    name: 'Treino B - Inferior',
    description: 'Foco em pernas e glúteos',
    exercises: [
      { id: 4, name: 'Agachamento', sets: 4, reps: 12, weight: 40, rest_time: 90 },
      { id: 5, name: 'Leg Press', sets: 3, reps: 15, weight: 100, rest_time: 60 },
      { id: 6, name: 'Extensão de Quadríceps', sets: 3, reps: 15, weight: 30, rest_time: 45 }
    ]
  }
];

interface WorkoutsListProps {
  initialWorkouts?: Workout[];
}

export default function WorkoutsList({ initialWorkouts }: WorkoutsListProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simula chamada à API
    const fetchWorkouts = async () => {
      try {
        // Se initialWorkouts foi fornecido, use-o
        if (initialWorkouts !== undefined) {
          setWorkouts(initialWorkouts);
        } else {
          // Caso contrário, use os dados mockados
          setWorkouts(mockWorkouts);
        }
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [isAuthenticated, router, initialWorkouts]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Meus Treinos</h1>
          <button
            onClick={() => router.push('/dashboard/workouts/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Criar novo treino"
          >
            Novo Treino
          </button>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Você ainda não tem nenhum treino cadastrado.</p>
            <button
              onClick={() => router.push('/dashboard/workouts/new')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar meu primeiro treino
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{workout.name}</h2>
                <p className="text-gray-600 mb-4">{workout.description}</p>
                <p className="text-sm text-gray-500 mb-4">Exercícios: {workout.exercises.length}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => router.push(`/dashboard/workouts/${workout.id}`)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/workouts/${workout.id}/start`)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Iniciar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 