import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FiCalendar, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WorkoutSession {
  id: number;
  workout_name: string;
  started_at: string;
  completed_at: string;
  performance_rating: number;
  notes: string;
}

export default function History() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Substituir por chamada real à API
    const fetchSessions = async () => {
      try {
        // Simular chamada à API
        const response = await fetch('/api/workout-sessions');
        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const performanceData = {
    labels: sessions.map(s => new Date(s.started_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Performance',
        data: sessions.map(s => s.performance_rating),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Evolução da Performance'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const calculateStats = () => {
    if (sessions.length === 0) return {
      totalWorkouts: 0,
      avgDuration: 0,
      avgPerformance: 0,
      streak: 0
    };

    const totalWorkouts = sessions.length;
    
    const durations = sessions.map(s => {
      const start = new Date(s.started_at);
      const end = new Date(s.completed_at);
      return (end.getTime() - start.getTime()) / (1000 * 60); // em minutos
    });
    const avgDuration = durations.reduce((a, b) => a + b, 0) / totalWorkouts;
    
    const avgPerformance = sessions.reduce((acc, s) => acc + s.performance_rating, 0) / totalWorkouts;
    
    // Calcular sequência atual
    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].completed_at).setHours(0, 0, 0, 0);
      const diff = (today - sessionDate) / (1000 * 60 * 60 * 24);
      if (diff === streak) streak++;
      else break;
    }

    return {
      totalWorkouts,
      avgDuration: Math.round(avgDuration),
      avgPerformance: avgPerformance.toFixed(1),
      streak
    };
  };

  const stats = calculateStats();

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Treinos</p>
                <p className="text-2xl font-semibold">{stats.totalWorkouts}</p>
              </div>
              <FiCalendar className="text-primary-500 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Duração Média</p>
                <p className="text-2xl font-semibold">{stats.avgDuration} min</p>
              </div>
              <FiClock className="text-primary-500 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Performance Média</p>
                <p className="text-2xl font-semibold">{stats.avgPerformance}/5</p>
              </div>
              <FiTrendingUp className="text-primary-500 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sequência Atual</p>
                <p className="text-2xl font-semibold">{stats.streak} dias</p>
              </div>
              <FiAward className="text-primary-500 h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Gráfico de Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <Line data={performanceData} options={chartOptions} />
        </div>

        {/* Lista de Treinos */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Histórico de Treinos</h3>
          </div>
          
          <div className="divide-y">
            {sessions.map((session) => (
              <div key={session.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{session.workout_name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(session.started_at).toLocaleDateString()} • 
                      Performance: {session.performance_rating}/5
                    </p>
                  </div>
                  {session.notes && (
                    <p className="text-sm text-gray-500 max-w-md truncate">
                      {session.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 