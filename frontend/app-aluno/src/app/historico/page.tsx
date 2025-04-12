'use client';

import { useState, useEffect } from 'react';
import { AuthLayout } from '@/components/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

interface WorkoutSession {
  id: string;
  date: string;
  duration: number;
  workoutType: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  calories: number;
  completed: boolean;
  feedback?: string;
  performanceRating?: number;
}

export default function HistoricoPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');

  useEffect(() => {
    // Simular carregamento de dados do histórico de treinos
    setTimeout(() => {
      const mockWorkoutHistory: WorkoutSession[] = [
        {
          id: '1',
          date: '2023-11-10T09:00:00Z',
          duration: 65,
          workoutType: 'Musculação',
          exercises: [
            { name: 'Supino Reto', sets: 4, reps: 12, weight: 60 },
            { name: 'Puxada Frontal', sets: 3, reps: 12, weight: 50 },
            { name: 'Desenvolvimento', sets: 3, reps: 10, weight: 30 },
            { name: 'Rosca Direta', sets: 3, reps: 15, weight: 20 },
          ],
          calories: 420,
          completed: true,
          feedback: 'Excelente treino, consegui aumentar o peso no supino!',
          performanceRating: 5
        },
        {
          id: '2',
          date: '2023-11-08T18:30:00Z',
          duration: 45,
          workoutType: 'Cardio',
          exercises: [
            { name: 'Corrida na Esteira', sets: 1, reps: 1 },
            { name: 'Bicicleta Ergométrica', sets: 1, reps: 1 },
          ],
          calories: 350,
          completed: true,
          feedback: 'Treino de cardio leve',
          performanceRating: 4
        },
        {
          id: '3',
          date: '2023-11-05T10:00:00Z',
          duration: 70,
          workoutType: 'Musculação',
          exercises: [
            { name: 'Agachamento', sets: 4, reps: 10, weight: 80 },
            { name: 'Leg Press', sets: 4, reps: 12, weight: 120 },
            { name: 'Cadeira Extensora', sets: 3, reps: 15, weight: 40 },
            { name: 'Stiff', sets: 3, reps: 12, weight: 50 },
          ],
          calories: 480,
          completed: true,
          feedback: 'Treino pesado de pernas, estou exausto',
          performanceRating: 4
        },
        {
          id: '4',
          date: '2023-11-03T17:00:00Z',
          duration: 60,
          workoutType: 'Funcional',
          exercises: [
            { name: 'Burpees', sets: 3, reps: 15 },
            { name: 'Jumping Jacks', sets: 3, reps: 30 },
            { name: 'Mountain Climbers', sets: 3, reps: 20 },
            { name: 'Prancha', sets: 3, reps: 1 },
          ],
          calories: 400,
          completed: false,
          feedback: 'Não consegui terminar o treino por falta de tempo',
          performanceRating: 2
        },
        {
          id: '5',
          date: '2023-10-30T09:30:00Z',
          duration: 55,
          workoutType: 'Musculação',
          exercises: [
            { name: 'Remada Curvada', sets: 4, reps: 12, weight: 50 },
            { name: 'Puxada Alta', sets: 3, reps: 10, weight: 45 },
            { name: 'Crucifixo', sets: 3, reps: 15, weight: 14 },
            { name: 'Tríceps Corda', sets: 3, reps: 15, weight: 25 },
          ],
          calories: 380,
          completed: true,
          feedback: 'Bom treino de costas e braços',
          performanceRating: 4
        },
      ];
      setWorkoutHistory(mockWorkoutHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredWorkouts = workoutHistory.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'completed') return workout.completed;
    if (filter === 'incomplete') return !workout.completed;
    if (filter === 'musculacao') return workout.workoutType === 'Musculação';
    if (filter === 'cardio') return workout.workoutType === 'Cardio';
    if (filter === 'funcional') return workout.workoutType === 'Funcional';
    return true;
  });

  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (sort === 'date-desc') return dateB - dateA;
    if (sort === 'date-asc') return dateA - dateB;
    if (sort === 'duration-desc') return b.duration - a.duration;
    if (sort === 'duration-asc') return a.duration - b.duration;
    if (sort === 'calories-desc') return b.calories - a.calories;
    if (sort === 'calories-asc') return a.calories - b.calories;
    return 0;
  });

  const handleWorkoutClick = (workout: WorkoutSession) => {
    setSelectedWorkout(workout);
  };

  const closeWorkoutDetail = () => {
    setSelectedWorkout(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Histórico de Treinos</h1>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos os Treinos</option>
              <option value="completed">Treinos Concluídos</option>
              <option value="incomplete">Treinos Incompletos</option>
              <option value="musculacao">Musculação</option>
              <option value="cardio">Cardio</option>
              <option value="funcional">Funcional</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 text-sm"
            >
              <option value="date-desc">Data (Mais Recente)</option>
              <option value="date-asc">Data (Mais Antigo)</option>
              <option value="duration-desc">Duração (Maior)</option>
              <option value="duration-asc">Duração (Menor)</option>
              <option value="calories-desc">Calorias (Maior)</option>
              <option value="calories-asc">Calorias (Menor)</option>
            </select>
          </div>
        </div>

        {sortedWorkouts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">Nenhum treino encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedWorkouts.map((workout) => (
              <div 
                key={workout.id}
                onClick={() => handleWorkoutClick(workout)}
                className={`bg-gray-800 rounded-lg p-5 shadow-md cursor-pointer transition-transform hover:scale-[1.02] ${
                  !workout.completed ? 'border-l-4 border-amber-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{workout.workoutType}</h2>
                    <p className="text-gray-400 text-sm">{formatDate(workout.date)}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    workout.completed ? 'bg-green-900 text-green-200' : 'bg-amber-900 text-amber-200'
                  }`}>
                    {workout.completed ? 'Concluído' : 'Incompleto'}
                  </div>
                </div>
                
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duração:</span>
                    <span className="text-white">{workout.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Calorias:</span>
                    <span className="text-white">{workout.calories} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Exercícios:</span>
                    <span className="text-white">{workout.exercises.length}</span>
                  </div>
                </div>
                
                {workout.performanceRating && (
                  <div className="mt-3 flex items-center">
                    <span className="text-gray-400 text-xs mr-2">Avaliação:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-4 h-4 ${star <= workout.performanceRating! ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalhes do treino */}
        {selectedWorkout && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-white">{selectedWorkout.workoutType}</h2>
                  <button 
                    onClick={closeWorkoutDetail}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Data e Hora</p>
                      <p className="text-white">{formatDate(selectedWorkout.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duração</p>
                      <p className="text-white">{selectedWorkout.duration} minutos</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Calorias</p>
                      <p className="text-white">{selectedWorkout.calories} kcal</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className={`font-semibold ${selectedWorkout.completed ? 'text-green-500' : 'text-amber-500'}`}>
                        {selectedWorkout.completed ? 'Concluído' : 'Incompleto'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-500 mb-2">Exercícios</h3>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2 pr-2 text-gray-400">Exercício</th>
                          <th className="py-2 px-2 text-gray-400">Séries</th>
                          <th className="py-2 px-2 text-gray-400">Reps</th>
                          <th className="py-2 pl-2 text-gray-400">Peso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedWorkout.exercises.map((exercise, index) => (
                          <tr key={index} className={index !== selectedWorkout.exercises.length - 1 ? 'border-b border-gray-700' : ''}>
                            <td className="py-3 pr-2 text-white">{exercise.name}</td>
                            <td className="py-3 px-2 text-white">{exercise.sets}</td>
                            <td className="py-3 px-2 text-white">{exercise.reps}</td>
                            <td className="py-3 pl-2 text-white">{exercise.weight ? `${exercise.weight} kg` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {selectedWorkout.feedback && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-500 mb-2">Feedback</h3>
                      <p className="text-white bg-gray-700 p-3 rounded-md">{selectedWorkout.feedback}</p>
                    </div>
                  )}
                  
                  {selectedWorkout.performanceRating && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-500 mb-2">Avaliação de Desempenho</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star}
                            className={`w-6 h-6 ${star <= selectedWorkout.performanceRating! ? 'text-yellow-400' : 'text-gray-600'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={closeWorkoutDetail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
} 