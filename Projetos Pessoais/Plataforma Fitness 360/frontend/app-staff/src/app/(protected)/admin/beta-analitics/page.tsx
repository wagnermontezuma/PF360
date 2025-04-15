'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Users, MessageSquare, Flag, Download } from 'lucide-react';

// Tipos de dados para análise de beta
interface BetaMetrics {
  usersCount: number;
  feedbackCount: number;
  activeFeatureFlags: {
    name: string;
    count: number;
    percentage: number;
  }[];
  feedbackByType: {
    type: string;
    count: number;
    percentage: number;
  }[];
  userActivity: {
    date: string;
    activeUsers: number;
    feedbackCount: number;
  }[];
}

// Dados de exemplo - em produção, seriam carregados da API
const mockBetaMetrics: BetaMetrics = {
  usersCount: 250,
  feedbackCount: 187,
  activeFeatureFlags: [
    { name: 'betaFeedback', count: 250, percentage: 100 },
    { name: 'aiTrainingRecommendations', count: 120, percentage: 48 },
    { name: 'nutritionTracking', count: 168, percentage: 67.2 },
    { name: 'groupClasses', count: 75, percentage: 30 },
    { name: 'progressPictures', count: 98, percentage: 39.2 },
    { name: 'personalTrainerChat', count: 45, percentage: 18 },
    { name: 'challengeModule', count: 35, percentage: 14 },
  ],
  feedbackByType: [
    { type: 'bug', count: 62, percentage: 33.2 },
    { type: 'improvement', count: 89, percentage: 47.6 },
    { type: 'feature', count: 31, percentage: 16.6 },
    { type: 'other', count: 5, percentage: 2.6 },
  ],
  userActivity: [
    { date: '2025-03-01', activeUsers: 120, feedbackCount: 15 },
    { date: '2025-03-02', activeUsers: 132, feedbackCount: 18 },
    { date: '2025-03-03', activeUsers: 145, feedbackCount: 22 },
    { date: '2025-03-04', activeUsers: 165, feedbackCount: 28 },
    { date: '2025-03-05', activeUsers: 178, feedbackCount: 24 },
    { date: '2025-03-06', activeUsers: 185, feedbackCount: 19 },
    { date: '2025-03-07', activeUsers: 198, feedbackCount: 21 },
    { date: '2025-03-08', activeUsers: 210, feedbackCount: 17 },
    { date: '2025-03-09', activeUsers: 228, feedbackCount: 13 },
    { date: '2025-03-10', activeUsers: 234, feedbackCount: 10 },
  ],
};

// Componente de gráfico de barras simples
const SimpleBarChart = ({ 
  data, 
  nameKey, 
  valueKey,
  colorClass = 'bg-blue-500',
  maxValue
}: { 
  data: any[]; 
  nameKey: string; 
  valueKey: string;
  colorClass?: string;
  maxValue?: number;
}) => {
  const highest = maxValue || Math.max(...data.map(item => item[valueKey]));
  
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item[nameKey]}</span>
            <span>{item[valueKey]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${colorClass}`} 
              style={{ width: `${(item[valueKey] / highest) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de métricas resumidas
const MetricCard = ({ 
  icon, 
  title, 
  value, 
  change,
  isPositive = true 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number;
  change?: string;
  isPositive?: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
  );
};

// Componente de linha do tempo de atividade
const ActivityTimeline = ({ data }: { data: BetaMetrics['userActivity'] }) => {
  // Calcula o valor máximo para escala
  const maxUsers = Math.max(...data.map(d => d.activeUsers));
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="h-[200px] relative flex items-end justify-between border-b border-gray-200">
          {data.map((day, i) => (
            <div key={i} className="flex flex-col items-center px-2">
              <div className="relative w-10 flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-6 rounded-t-sm" 
                  style={{ height: `${(day.activeUsers / maxUsers) * 160}px` }}
                ></div>
                <div 
                  className="bg-green-500 absolute bottom-0 w-3 rounded-t-sm" 
                  style={{ height: `${(day.feedbackCount / maxUsers) * 160}px`, right: '8px' }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </div>
            </div>
          ))}
          
          {/* Linhas de grade */}
          <div className="absolute left-0 right-0 top-0 border-t border-gray-100 h-0"></div>
          <div className="absolute left-0 right-0 top-1/4 border-t border-gray-100 h-0"></div>
          <div className="absolute left-0 right-0 top-2/4 border-t border-gray-100 h-0"></div>
          <div className="absolute left-0 right-0 top-3/4 border-t border-gray-100 h-0"></div>
        </div>
        
        <div className="flex justify-center mt-4 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
            <span>Usuários ativos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
            <span>Feedbacks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BetaAnalyticsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<BetaMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  
  // Função para carregar métricas da API (simulada)
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      
      try {
        // Em produção, isto seria uma chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics(mockBetaMetrics);
      } catch (error) {
        console.error('Erro ao carregar métricas beta:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeRange]);

  // Função para exportar relatório como CSV (simulada)
  const exportReport = () => {
    alert('Relatório exportado com sucesso!');
  };
  
  // Exibir carregamento
  if (isLoading) {
    return (
      <div className="p-6 max-w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }
  
  // Se não tiver dados
  if (!metrics) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-yellow-800">Dados não disponíveis</h2>
          <p className="text-yellow-700">Não foi possível carregar os dados do programa beta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Análise do Programa Beta</h1>
            <p className="text-gray-500 text-sm">
              Dados e métricas sobre o uso e feedback dos recursos beta
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="14d">Últimos 14 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          <button 
            onClick={exportReport}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Download size={16} className="mr-1" />
            Exportar
          </button>
        </div>
      </div>
      
      {/* Cards de métricas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          icon={<Users size={24} />} 
          title="Usuários Beta" 
          value={metrics.usersCount} 
          change="12%" 
        />
        <MetricCard 
          icon={<MessageSquare size={24} />} 
          title="Feedbacks Recebidos" 
          value={metrics.feedbackCount} 
          change="8.5%" 
        />
        <MetricCard 
          icon={<Flag size={24} />} 
          title="Feature Flags Ativas" 
          value={metrics.activeFeatureFlags.length} 
        />
        <MetricCard 
          icon={<BarChart3 size={24} />} 
          title="Taxa de Feedback" 
          value={`${((metrics.feedbackCount / metrics.usersCount) * 100).toFixed(1)}%`} 
          change="2.3%" 
        />
      </div>
      
      {/* Gráfico de atividade */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Atividade de Usuários</h2>
        <ActivityTimeline data={metrics.userActivity} />
      </div>
      
      {/* Análise detalhada de features e feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Feature Flags Ativas</h2>
          <SimpleBarChart 
            data={metrics.activeFeatureFlags} 
            nameKey="name" 
            valueKey="percentage" 
            colorClass="bg-blue-500"
            maxValue={100}
          />
          <div className="mt-4 text-sm text-gray-500">
            Porcentagem de usuários com cada feature flag ativa
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Tipos de Feedback</h2>
          <SimpleBarChart 
            data={metrics.feedbackByType} 
            nameKey="type" 
            valueKey="count" 
            colorClass="bg-green-500"
          />
          <div className="mt-4 text-sm text-gray-500">
            Distribuição dos {metrics.feedbackCount} feedbacks por categoria
          </div>
        </div>
      </div>
      
      {/* Recomendações */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-blue-100">
        <h2 className="text-lg font-medium text-blue-800 mb-3">Recomendações</h2>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>
              Considere expandir o acesso à feature <strong>AI Training Recommendations</strong> para mais usuários, 
              com base no alto número de feedbacks positivos.
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>
              Investigue os problemas reportados com a feature <strong>Personal Trainer Chat</strong>, 
              que recebeu vários relatos de bugs.
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>
              A taxa de feedback diminuiu nos últimos 3 dias. Considere enviar lembretes para incentivar 
              os usuários a compartilharem suas experiências.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
} 