import { FC, useState } from 'react'
import { Exercise } from '../../types/exercise'
import { exerciseService } from '../../services/exerciseService'
import { toast } from 'react-hot-toast'

interface ExerciseFormProps {
  exercise?: Exercise
  onSuccess: () => void
  onCancel: () => void
}

export const ExerciseForm: FC<ExerciseFormProps> = ({
  exercise,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Exercise>>(
    exercise || {
      name: '',
      description: '',
      muscle_group: '',
      equipment: '',
      difficulty_level: 'intermediate',
      video_url: '',
      image_url: '',
      instructions: ''
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (exercise) {
        await exerciseService.update(exercise.id, formData)
        toast.success('Exercício atualizado com sucesso')
      } else {
        await exerciseService.create(formData)
        toast.success('Exercício criado com sucesso')
      }
      onSuccess()
    } catch (err) {
      toast.error('Erro ao salvar exercício')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const muscleGroups = exerciseService.getMuscleGroups()
  const difficultyLevels = exerciseService.getDifficultyLevels()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="muscle_group" className="block text-sm font-medium text-gray-700">
            Grupo Muscular *
          </label>
          <select
            id="muscle_group"
            name="muscle_group"
            value={formData.muscle_group}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {Object.entries(muscleGroups).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700">
            Nível de Dificuldade *
          </label>
          <select
            id="difficulty_level"
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.entries(difficultyLevels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">
          Equipamento
        </label>
        <input
          type="text"
          id="equipment"
          name="equipment"
          value={formData.equipment}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-gray-700">
            URL do Vídeo
          </label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            URL da Imagem
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
          Instruções *
        </label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : exercise ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
} 