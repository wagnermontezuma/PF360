'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardMetricsData {
  faturamentoMensal: number;
  planosAtivos: number;
  ticketMedio: number;
  metricas: {
    receitaTotal: number;
    crescimentoMensal: number;
    taxaRenovacao: number;
  };
  planosPorTipo: {
    basic: number;
    premium: number;
    enterprise: number;
  };
  ultimasFaturas: Array<{
    id: number;
    cliente: string;
    valor: number;
    status: string;
    data: string;
  }>;
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        const response = await fetch('http://localhost:3004/billing/dashboard-metrics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar métricas');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao carregar métricas');
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-gray-400 mb-2">Faturamento Mensal</h3>
          <p className="text-2xl font-bold text-white">
            R$ {metrics?.faturamentoMensal?.toLocaleString('pt-BR') ?? 0}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-gray-400 mb-2">Planos Ativos</h3>
          <p className="text-2xl font-bold text-white">{metrics?.planosAtivos ?? 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-gray-400 mb-2">Ticket Médio</h3>
          <p className="text-2xl font-bold text-white">
            R$ {metrics?.ticketMedio?.toLocaleString('pt-BR') ?? 0}
          </p>
        </motion.div>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Planos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">Distribuição de Planos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-300">
              <span>Basic</span>
              <span>{metrics?.planosPorTipo?.basic ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>Premium</span>
              <span>{metrics?.planosPorTipo?.premium ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>Enterprise</span>
              <span>{metrics?.planosPorTipo?.enterprise ?? 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Últimas Faturas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">Últimas Faturas</h3>
          <div className="space-y-4">
            {metrics?.ultimasFaturas?.map((fatura) => (
              <div key={fatura.id} className="flex justify-between items-center text-gray-300">
                <span>{new Date(fatura.data).toLocaleDateString('pt-BR')}</span>
                <span>R$ {fatura.valor.toLocaleString('pt-BR')}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  fatura.status === 'PAGO' ? 'bg-green-500/20 text-green-400' : 
                  fatura.status === 'PENDENTE' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {fatura.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 