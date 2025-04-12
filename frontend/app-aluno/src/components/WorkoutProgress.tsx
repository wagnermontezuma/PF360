import { FC } from 'react';
import { FiClock, FiActivity, FiAward } from 'react-icons/fi';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time: number;
  completed_sets: number;
}

interface WorkoutProgressProps {
  workoutName: string;
  startTime: string;
  exercises: Exercise[];
  currentExerciseIndex: number;
  onExerciseComplete: (exerciseId: number, setNumber: number) => void;
}

export const WorkoutProgress: FC<WorkoutProgressProps> = ({
  workoutName,
  startTime,
  exercises,
  currentExerciseIndex,
  onExerciseComplete
}) => {
  const calculateProgress = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = exercises.reduce((acc, ex) => acc + (ex.completed_sets || 0), 0);
    return (completedSets / totalSets) * 100;
  };

  const formatDuration = (startTimeStr: string) => {
    const start = new Date(startTimeStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000); // segundos
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{workoutName}</h2>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <FiClock className="mr-2" />
            <span>Duração: {formatDuration(startTime)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <FiActivity className="text-primary-500 mr-2" />
          <span className="text-lg font-medium text-primary-600">
            {Math.round(calculateProgress())}%
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      {/* Lista de Exercícios */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className={`p-4 rounded-lg border ${
              index === currentExerciseIndex
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{exercise.name}</h3>
              {exercise.completed_sets === exercise.sets && (
                <FiAward className="text-green-500" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">{exercise.sets}</span> séries
              </div>
              <div>
                <span className="font-medium">{exercise.reps}</span> reps
              </div>
              <div>
                <span className="font-medium">{exercise.weight}</span> kg
              </div>
            </div>

            {/* Progresso das Séries */}
            <div className="mt-3 flex gap-2">
              {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                <button
                  key={setIndex}
                  onClick={() => onExerciseComplete(exercise.id, setIndex + 1)}
                  disabled={index !== currentExerciseIndex}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    setIndex < (exercise.completed_sets || 0)
                      ? 'bg-green-500'
                      : index === currentExerciseIndex
                      ? 'bg-gray-300 hover:bg-primary-300'
                      : 'bg-gray-200'
                  }`}
                  aria-label={`Série ${setIndex + 1}`}
                />
              ))}
            </div>

            {/* Timer de Descanso */}
            {index === currentExerciseIndex && exercise.completed_sets > 0 && exercise.completed_sets < exercise.sets && (
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <FiClock className="mr-2" />
                Descanso: {exercise.rest_time}s
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 