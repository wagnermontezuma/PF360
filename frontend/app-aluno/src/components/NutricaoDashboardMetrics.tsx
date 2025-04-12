'use client';

import { useState, useEffect } from 'react';
import { FiActivity, FiCalendar, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface NutricaoDashboardMetricsData {
  planoAtivo: {
    nome: string;
    dataInicio: string;
    dataFim: string;
    status: 'ativo' | 'expirado' | 'pendente';
  };
  consultas: {
    realizadas: number;
    agendadas: number;
    canceladas: number;
  };
  progresso: {
    pesoInicial: number;
    pesoAtual: number;
    metaPeso: number;
    percentualAlcancado: number;
  };
  proximasConsultas: Array<{
    id: string;
    data: string;
    nutricionista: string;
    tipo: 'online' | 'presencial';
    status: 'agendada' | 'confirmada' | 'cancelada';
  }>;
}

export function NutricaoDashboardMetrics() {
  const [metricsData, setMetricsData] = useState<NutricaoDashboardMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        
        // Simulando dados até que a API esteja disponível
        // Em produção, substituir por: 
        // const response = await fetch('http://localhost:3004/nutrition/dashboard-metrics', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });
        // if (!response.ok) throw new Error('Falha ao buscar métricas de nutrição');
        // const data = await response.json();
        
        // Dados simulados
        const mockData: NutricaoDashboardMetricsData = {
          planoAtivo: {
            nome: 'Plano Nutricional Premium',
            dataInicio: '2023-10-15',
            dataFim: '2024-10-15',
            status: 'ativo'
          },
          consultas: {
            realizadas: 4,
            agendadas: 2,
            canceladas: 1
          },
          progresso: {
            pesoInicial: 85.5,
            pesoAtual: 80.2,
            metaPeso: 75.0,
            percentualAlcancado: 62
          },
          proximasConsultas: [
            {
              id: '1',
              data: '2023-12-10T14:00:00',
              nutricionista: 'Dra. Mariana Silva',
              tipo: 'online',
              status: 'confirmada'
            },
            {
              id: '2',
              data: '2024-01-05T10:30:00',
              nutricionista: 'Dr. Rafael Mendes',
              tipo: 'presencial',
              status: 'agendada'
            }
          ]
        };
        
        setMetricsData(mockData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados de nutrição. Tente novamente mais tarde.');
        console.error('Erro ao buscar métricas de nutrição:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  if (!metricsData) {
    return (
      <div className="text-center text-gray-600">
        Nenhum dado disponível no momento.
      </div>
    );
  }

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plano Ativo */}
        <div 
          className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 opacity-0 animate-fadeIn"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Plano Nutricional Ativo</h2>
          <div className="space-y-2">
            <p className="text-xl font-bold text-purple-400">{metricsData.planoAtivo.nome}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Período:</span>
              <span className="text-white">
                {formatarData(metricsData.planoAtivo.dataInicio)} a {formatarData(metricsData.planoAtivo.dataFim)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${
                metricsData.planoAtivo.status === 'ativo' ? 'text-green-400' : 
                metricsData.planoAtivo.status === 'pendente' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {metricsData.planoAtivo.status.charAt(0).toUpperCase() + metricsData.planoAtivo.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Consultas */}
        <div 
          className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 opacity-0 animate-fadeIn"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Consultas</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{metricsData.consultas.realizadas}</p>
              <p className="text-gray-400 text-sm">Realizadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{metricsData.consultas.agendadas}</p>
              <p className="text-gray-400 text-sm">Agendadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{metricsData.consultas.canceladas}</p>
              <p className="text-gray-400 text-sm">Canceladas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 opacity-0 animate-fadeIn"
        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Progresso de Peso</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg text-gray-400">Peso Inicial</p>
            <p className="text-2xl font-bold text-white">{metricsData.progresso.pesoInicial} kg</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-400">Peso Atual</p>
            <p className="text-2xl font-bold text-purple-400">{metricsData.progresso.pesoAtual} kg</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-400">Meta</p>
            <p className="text-2xl font-bold text-green-400">{metricsData.progresso.metaPeso} kg</p>
          </div>
          <div className="text-center">
            <div className="relative pt-1">
              <p className="text-lg text-gray-400">Progresso</p>
              <div className="overflow-hidden h-6 mb-1 text-xs flex rounded bg-gray-700">
                <div 
                  style={{ width: `${metricsData.progresso.percentualAlcancado}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                ></div>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold inline-block text-purple-400">
                  {metricsData.progresso.percentualAlcancado}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Próximas Consultas */}
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 opacity-0 animate-fadeIn"
        style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Próximas Consultas</h2>
        {metricsData.proximasConsultas.length > 0 ? (
          <div className="space-y-4">
            {metricsData.proximasConsultas.map((consulta) => (
              <div key={consulta.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{consulta.nutricionista}</p>
                  <p className="text-gray-400 text-sm">{formatarDataHora(consulta.data)}</p>
                  <div className="mt-1 flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      consulta.tipo === 'online' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'
                    }`}>
                      {consulta.tipo === 'online' ? 'Online' : 'Presencial'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  {consulta.status === 'confirmada' ? (
                    <FiCheckCircle className="text-green-400 h-5 w-5" />
                  ) : consulta.status === 'agendada' ? (
                    <FiCalendar className="text-blue-400 h-5 w-5" />
                  ) : (
                    <FiAlertTriangle className="text-red-400 h-5 w-5" />
                  )}
                  <span className={`ml-2 ${
                    consulta.status === 'confirmada' ? 'text-green-400' : 
                    consulta.status === 'agendada' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Nenhuma consulta agendada no momento.
          </div>
        )}
      </div>
    </div>
  );
} 