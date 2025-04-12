import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiActivity, FiClock, FiFire, FiTrendingUp } from 'react-icons/fi'

interface WorkoutStats {
  total_workouts: number
  total_duration: number
  total_calories: number
  workouts_by_difficulty: Array<{
    difficulty_rating: string
    count: number
  }>
  workouts_by_date: Array<{
    date: string
    count: number
  }>
}

interface WorkoutMetricsProps {
  userId: number
  dateRange?: {
    from: string
    to: string
  }
}

const DIFFICULTY_COLORS = {
  easy: '#10B981',
  moderate: '#F59E0B',
  hard: '#EF4444'
}

export const WorkoutMetrics: FC<WorkoutMetricsProps> = ({
  userId,
  dateRange
}) => {
  const [stats, setStats] = useState<WorkoutStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data } = await axios.get('/api/workout-history/stats', {
          params: dateRange
        })
        
        setStats(data)
      } catch (err) {
        setError('Erro ao carregar métricas')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [dateRange])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-lg">
        {error || 'Erro ao carregar dados'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiActivity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Treinos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total_workouts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FiClock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tempo Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(stats.total_duration / 60)} min
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <FiFire className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Calorias Queimadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total_calories} kcal
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiTrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Média por Semana</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(stats.total_workouts / 4)} treinos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treinos por data */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Treinos por Data
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.workouts_by_date}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), 'd MMM', { locale: ptBR })}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date as string), 'dd/MM/yyyy')}
                  formatter={(value) => [value, 'Treinos']}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treinos por dificuldade */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Treinos por Dificuldade
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.workouts_by_difficulty}
                  dataKey="count"
                  nameKey="difficulty_rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ difficulty_rating }) => 
                    difficulty_rating === 'easy' ? 'Fácil' :
                    difficulty_rating === 'moderate' ? 'Moderado' : 'Difícil'
                  }
                >
                  {stats.workouts_by_difficulty.map((entry) => (
                    <Cell
                      key={entry.difficulty_rating}
                      fill={DIFFICULTY_COLORS[entry.difficulty_rating as keyof typeof DIFFICULTY_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 