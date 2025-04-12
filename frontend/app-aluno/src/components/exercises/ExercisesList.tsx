import { FC, useState, useEffect } from 'react'
import { Exercise } from '../../types/exercise'
import { exerciseService } from '../../services/exerciseService'
import { LoadingSpinner } from '../LoadingSpinner'

interface ExercisesListProps {
  muscleGroup?: string
  onSelectExercise?: (exercise: Exercise) => void
}

export const ExercisesList: FC<ExercisesListProps> = ({ muscleGroup, onSelectExercise }) => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true)
        const data = muscleGroup 
          ? await exerciseService.getByMuscleGroup(muscleGroup)
          : await exerciseService.getAll()
        
        setExercises(data)
      } catch (err) {
        setError('Erro ao carregar exercícios')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [muscleGroup])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        Nenhum exercício encontrado
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectExercise?.(exercise)}
        >
          {exercise.image_url && (
            <div className="relative h-48 mb-4">
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {exerciseService.getMuscleGroups()[exercise.muscle_group]}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
              {exerciseService.getDifficultyLevels()[exercise.difficulty_level]}
            </span>
          </div>
          
          {exercise.equipment && (
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-medium">Equipamento:</span> {exercise.equipment}
            </p>
          )}

          <p className="text-gray-600 text-sm line-clamp-3">
            {exercise.description}
          </p>
        </div>
      ))}
    </div>
  )
} 