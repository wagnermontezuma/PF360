import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import DashboardLayout from '../../../components/DashboardLayout';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export default function WorkoutDetails() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!id) return;

    // TODO: Substituir por chamada real à API
    const mockWorkout: Workout = {
      id: id as string,
      name: 'Treino A - Superior',
      description: 'Foco em peito, ombros e tríceps',
      exercises: [
        { id: '1', name: 'Supino Reto', sets: 4, reps: 12, weight: 20, restTime: 60 },
        { id: '2', name: 'Desenvolvimento', sets: 3, reps: 12, weight: 15, restTime: 60 },
        { id: '3', name: 'Extensão de Tríceps', sets: 3, reps: 15, weight: 10, restTime: 45 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWorkout(mockWorkout);
    setLoading(false);
  }, [id, isAuthenticated, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Treino não encontrado</h1>
          <button
            onClick={() => router.push('/dashboard/workouts')}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Voltar para lista de treinos
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{workout.name}</h1>
            <p className="text-gray-600 mt-2">{workout.description}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/workouts')}
            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Exercícios</h2>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {index + 1}. {exercise.name}
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Séries:</span> {exercise.sets}
                      </div>
                      <div>
                        <span className="font-medium">Repetições:</span> {exercise.reps}
                      </div>
                      <div>
                        <span className="font-medium">Carga:</span> {exercise.weight}kg
                      </div>
                      <div>
                        <span className="font-medium">Descanso:</span> {exercise.restTime}s
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    aria-label={`Editar exercício ${exercise.name}`}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push(`/dashboard/workouts/${id}/edit`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Editar Treino
          </button>
          <button
            onClick={() => router.push(`/dashboard/workouts/${id}/start`)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Iniciar Treino
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 