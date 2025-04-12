import { useState } from 'react'
import { ExercisesList } from '../../../components/exercises/ExercisesList'
import { ExerciseForm } from '../../../components/exercises/ExerciseForm'
import { Exercise, MuscleGroup } from '../../../types/exercise'
import { api } from '../../../lib/api'

const muscleGroups = {
  chest: 'Peitoral',
  back: 'Costas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  legs: 'Pernas',
  abs: 'Abdômen',
  cardio: 'Cardio'
}

export default function ExercisesPage() {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | ''>('')
  const [showForm, setShowForm] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedExercise(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Exercícios</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Novo Exercício
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="muscle-group" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por Grupo Muscular
        </label>
        <select
          id="muscle-group"
          value={selectedMuscleGroup}
          onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | '')}
          className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          {Object.entries(muscleGroups).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedExercise ? 'Editar Exercício' : 'Novo Exercício'}
          </h2>
          <ExerciseForm
            exercise={selectedExercise || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setSelectedExercise(null)
            }}
          />
        </div>
      ) : (
        <ExercisesList
          muscleGroup={selectedMuscleGroup || undefined}
          onSelectExercise={handleExerciseSelect}
        />
      )}
    </div>
  )
} 