'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  ClockIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Dados mockados para o dashboard
const mockDashboardData = {
  metrics: {
    totalMembers: 248,
    activeMembers: 217,
    newMembersThisMonth: 15,
    retentionRate: 93.2
  },
  memberGrowth: [
    { month: 'Jan', members: 218 },
    { month: 'Fev', members: 223 },
    { month: 'Mar', members: 229 },
    { month: 'Abr', members: 231 },
    { month: 'Mai', members: 236 },
    { month: 'Jun', members: 242 },
    { month: 'Jul', members: 248 }
  ],
  activitiesByDay: [
    { day: 'Seg', treinos: 82, nutricao: 24 },
    { day: 'Ter', treinos: 91, nutricao: 18 },
    { day: 'Qua', treinos: 87, nutricao: 25 },
    { day: 'Qui', treinos: 95, nutricao: 31 },
    { day: 'Sex', treinos: 89, nutricao: 22 },
    { day: 'Sáb', treinos: 63, nutricao: 8 },
    { day: 'Dom', treinos: 34, nutricao: 4 }
  ],
  recentMembers: [
    { id: '1', name: 'Ana Silva', plan: 'Premium', joinDate: '2023-06-28', status: 'active' },
    { id: '2', name: 'João Oliveira', plan: 'Básico', joinDate: '2023-07-01', status: 'active' },
    { id: '3', name: 'Maria Santos', plan: 'Premium+', joinDate: '2023-07-05', status: 'active' },
    { id: '4', name: 'Carlos Souza', plan: 'Premium', joinDate: '2023-07-08', status: 'pending' },
    { id: '5', name: 'Beatriz Lima', plan: 'Básico', joinDate: '2023-07-12', status: 'active' }
  ]
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [isLoading, setIsLoading] = useState(false);

  // No futuro, substituir por chamada real à API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulando chamada à API
        setTimeout(() => {
          setDashboardData(mockDashboardData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select className="rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-white text-sm">
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
            <option value="year">Este ano</option>
          </select>
          <button className="btn-primary">Atualizar</button>
        </div>
      </div>

      {/* Cartões de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.totalMembers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-success-700 font-medium">
                +{dashboardData.metrics.newMembersThisMonth} este mês
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-secondary-100 p-3 rounded-full">
              <UserIcon className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Alunos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.activeMembers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {Math.round((dashboardData.metrics.activeMembers / dashboardData.metrics.totalMembers) * 100)}% do total
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-success-100 p-3 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-success-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Taxa de Retenção</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.retentionRate}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-success-700 font-medium">
                +2.4% vs. mês anterior
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-warning-100 p-3 rounded-full">
              <ClockIcon className="h-6 w-6 text-warning-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Treinos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">43</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                8 consultas nutricionais
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Alunos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.memberGrowth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="members"
                  name="Alunos"
                  stroke="#0284c7"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades por Dia da Semana</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.activitiesByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="treinos" name="Treinos" fill="#0284c7" />
                <Bar dataKey="nutricao" name="Nutrição" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de alunos recentes */}
      <div className="card bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Novos Alunos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Entrada
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-600 flex items-center justify-center text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(member.joinDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === 'active'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-warning-100 text-warning-700'
                      }`}
                    >
                      {member.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/alunos/${member.id}`} className="text-primary-600 hover:text-primary-900">
                      Ver Perfil
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <a href="/alunos" className="text-primary-600 hover:text-primary-900 font-medium">
            Ver todos os alunos →
          </a>
        </div>
      </div>
    </div>
  );
} 