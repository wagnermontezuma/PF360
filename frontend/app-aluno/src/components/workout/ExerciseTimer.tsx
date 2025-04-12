import { FC, useState } from 'react'
import { Exercise } from '../../types/exercise'
import { Timer } from './Timer'

interface ExerciseTimerProps {
  exercise: Exercise
  onComplete?: () => void
  defaultTime?: number
}

export const ExerciseTimer: FC<ExerciseTimerProps> = ({
  exercise,
  onComplete,
  defaultTime = 60
}) => {
  const [showInstructions, setShowInstructions] = useState(true)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lado esquerdo - Informações do exercício */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">{exercise.name}</h2>
          
          {exercise.image_url && (
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full mb-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 
              rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showInstructions ? 'Ocultar Instruções' : 'Mostrar Instruções'}
          </button>

          {showInstructions && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Instruções:</h3>
              <p className="whitespace-pre-line">{exercise.instructions}</p>
            </div>
          )}
        </div>

        {/* Lado direito - Timer */}
        <div className="md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <Timer
              initialTime={defaultTime}
              onComplete={onComplete}
              showControls={true}
            />
          </div>

          {/* Informações adicionais */}
          <div className="mt-6 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="block text-sm text-gray-500">Equipamento</span>
                <span className="font-medium">{exercise.equipment || 'Nenhum'}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="block text-sm text-gray-500">Dificuldade</span>
                <span className="font-medium capitalize">{exercise.difficulty_level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {exercise.video_url && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Vídeo Demonstrativo:</h3>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={exercise.video_url}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allowFullScreen
              title={`Vídeo demonstrativo: ${exercise.name}`}
            />
          </div>
        </div>
      )}
    </div>
  )
} 