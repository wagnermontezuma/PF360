import { FC, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'
import { FiCalendar, FiClock, FiFire, FiBarChart2 } from 'react-icons/fi'

interface WorkoutHistoryEntry {
  id: number
  workout: {
    id: number
    name: string
  }
  started_at: string
  completed_at: string
  duration_seconds: number
  calories_burned: number
  difficulty_rating: 'easy' | 'moderate' | 'hard'
  completed: boolean
  exercise_progress: Array<{
    exercise_id: number
    sets_completed: number
    reps_completed: number
    weight_used?: number
  }>
}

interface WorkoutHistoryProps {
  userId: number
}

export const WorkoutHistory: FC<WorkoutHistoryProps> = ({ userId }) => {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    completed: true,
    dateFrom: format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'),
    dateTo: format(new Date(), 'yyyy-MM-dd')
  })

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data } = await axios.get('/api/workout-history', {
          params: filters
        })
        
        setHistory(data.data)
      } catch (err) {
        setError('Erro ao carregar histórico de treinos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [filters])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.completed ? 'completed' : 'in_progress'}
            onChange={(e) => setFilters({
              ...filters,
              completed: e.target.value === 'completed'
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="completed">Concluídos</option>
            <option value="in_progress">Em Progresso</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({
              ...filters,
              dateFrom: e.target.value
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Final
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({
              ...filters,
              dateTo: e.target.value
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Lista de treinos */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Nenhum treino encontrado para o período selecionado.</p>
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {entry.workout.name}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-1" />
                      {format(new Date(entry.started_at), "d 'de' MMMM', às' HH:mm", {
                        locale: ptBR
                      })}
                    </div>
                  </div>
                  
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getDifficultyColor(entry.difficulty_rating)
                    }`}
                  >
                    {entry.difficulty_rating === 'easy' ? 'Fácil' :
                     entry.difficulty_rating === 'moderate' ? 'Moderado' : 'Difícil'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <FiClock className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {Math.round(entry.duration_seconds / 60)} min
                      </p>
                      <p className="text-xs text-gray-500">Duração</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiFire className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {entry.calories_burned} kcal
                      </p>
                      <p className="text-xs text-gray-500">Calorias</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiBarChart2 className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {entry.exercise_progress.length} exercícios
                      </p>
                      <p className="text-xs text-gray-500">Realizados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 