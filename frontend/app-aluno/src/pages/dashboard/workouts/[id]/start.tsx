import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../hooks/useAuth';
import DashboardLayout from '../../../../components/DashboardLayout';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  completedSets: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  startTime?: string;
  endTime?: string;
}

export default function StartWorkout() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number | null>(null);
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
        { id: '1', name: 'Supino Reto', sets: 4, reps: 12, weight: 20, restTime: 60, completedSets: 0 },
        { id: '2', name: 'Desenvolvimento', sets: 3, reps: 12, weight: 15, restTime: 60, completedSets: 0 },
        { id: '3', name: 'Extensão de Tríceps', sets: 3, reps: 15, weight: 10, restTime: 45, completedSets: 0 }
      ],
      startTime: new Date().toISOString()
    };

    setWorkout(mockWorkout);
    setLoading(false);
  }, [id, isAuthenticated, router]);

  useEffect(() => {
    if (timer === null) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleCompleteSet = () => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    const currentExercise = updatedWorkout.exercises[currentExerciseIndex];
    currentExercise.completedSets++;

    if (currentExercise.completedSets === currentExercise.sets) {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        // Treino finalizado
        updatedWorkout.endTime = new Date().toISOString();
        // TODO: Enviar dados para API
        router.push('/dashboard/workouts');
        return;
      }
    }

    setTimer(currentExercise.restTime);
    setWorkout(updatedWorkout);
  };

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

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = (currentExercise.completedSets / currentExercise.sets) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
              <p className="text-gray-600 mt-1">Exercício {currentExerciseIndex + 1} de {workout.exercises.length}</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Deseja realmente cancelar o treino?')) {
                  router.push('/dashboard/workouts');
                }
              }}
              className="text-red-500 hover:text-red-600"
            >
              Cancelar
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{currentExercise.name}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Séries:</span>
                  <span className="font-medium ml-2">
                    {currentExercise.completedSets}/{currentExercise.sets}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Repetições:</span>
                  <span className="font-medium ml-2">{currentExercise.reps}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Carga:</span>
                  <span className="font-medium ml-2">{currentExercise.weight}kg</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Descanso:</span>
                  <span className="font-medium ml-2">{currentExercise.restTime}s</span>
                </div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progresso
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                ></div>
              </div>
            </div>

            {timer !== null ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  Descanse por {timer} segundos
                </div>
                <div className="text-gray-600">
                  Próxima série: {currentExercise.name}
                </div>
              </div>
            ) : (
              <button
                onClick={handleCompleteSet}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors text-lg font-medium"
              >
                {currentExercise.completedSets === currentExercise.sets - 1 &&
                currentExerciseIndex === workout.exercises.length - 1
                  ? 'Finalizar Treino'
                  : 'Completar Série'}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 