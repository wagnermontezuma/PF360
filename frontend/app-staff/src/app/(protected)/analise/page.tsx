'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Dados mockados para a página de análise
const mockData = {
  membersProgress: {
    weightProgress: [
      { month: 'Jan', media: 78.2, melhorAluno: 72.5, piorAluno: 86.4 },
      { month: 'Fev', media: 77.5, melhorAluno: 71.2, piorAluno: 85.1 },
      { month: 'Mar', media: 76.8, melhorAluno: 70.1, piorAluno: 84.2 },
      { month: 'Abr', media: 75.9, melhorAluno: 69.3, piorAluno: 83.0 },
      { month: 'Mai', media: 75.4, melhorAluno: 68.5, piorAluno: 82.1 },
      { month: 'Jun', media: 74.8, melhorAluno: 67.9, piorAluno: 81.4 },
      { month: 'Jul', media: 74.3, melhorAluno: 67.2, piorAluno: 80.8 }
    ],
    bodyFatProgress: [
      { month: 'Jan', media: 22.3, melhorAluno: 16.8, piorAluno: 28.5 },
      { month: 'Fev', media: 21.8, melhorAluno: 16.1, piorAluno: 27.9 },
      { month: 'Mar', media: 21.2, melhorAluno: 15.5, piorAluno: 27.2 },
      { month: 'Abr', media: 20.7, melhorAluno: 14.9, piorAluno: 26.6 },
      { month: 'Mai', media: 20.1, melhorAluno: 14.2, piorAluno: 26.0 },
      { month: 'Jun', media: 19.5, melhorAluno: 13.8, piorAluno: 25.5 },
      { month: 'Jul', media: 19.0, melhorAluno: 13.4, piorAluno: 25.0 }
    ],
    workoutFrequency: [
      { name: '0-1 dia/semana', value: 24 },
      { name: '2-3 dias/semana', value: 45 },
      { name: '4-5 dias/semana', value: 26 },
      { name: '6+ dias/semana', value: 5 }
    ],
    goalAchievement: [
      { name: 'Emagrecimento', alcancado: 68, naoAlcancado: 32 },
      { name: 'Ganho muscular', alcancado: 72, naoAlcancado: 28 },
      { name: 'Resistência', alcancado: 59, naoAlcancado: 41 },
      { name: 'Força', alcancado: 75, naoAlcancado: 25 }
    ]
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalisePage() {
  const [progressData, setProgressData] = useState(mockData.membersProgress);
  const [selectedMember, setSelectedMember] = useState('todos');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [isLoading, setIsLoading] = useState(false);

  // No futuro, substituir por chamada real à API
  useEffect(() => {
    const fetchProgressData = async () => {
      setIsLoading(true);
      try {
        // Simulando chamada à API
        setTimeout(() => {
          setProgressData(mockData.membersProgress);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erro ao carregar dados de progresso:', error);
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [selectedMember, selectedPeriod]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Análise de Progresso</h1>
        <div className="flex items-center space-x-4">
          <select 
            className="rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-white text-sm"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="todos">Todos os alunos</option>
            <option value="1">Ana Silva</option>
            <option value="2">João Oliveira</option>
            <option value="3">Maria Santos</option>
          </select>
          <select 
            className="rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-white text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="1year">Último ano</option>
          </select>
          <button className="btn-primary">Atualizar</button>
        </div>
      </div>

      {/* Gráficos de progressão */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Progresso de Peso */}
        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progresso de Peso (kg)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressData.weightProgress}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="media"
                  name="Média"
                  stroke="#0284c7"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="melhorAluno"
                  name="Melhor resultado"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="piorAluno"
                  name="Resultado a melhorar"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Progresso de Gordura Corporal */}
        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progresso de Gordura Corporal (%)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={progressData.bodyFatProgress}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="media"
                  name="Média"
                  stroke="#0284c7"
                  fill="#bae6fd"
                />
                <Area
                  type="monotone"
                  dataKey="melhorAluno"
                  name="Melhor resultado"
                  stroke="#10b981"
                  fill="#86efac"
                />
                <Area
                  type="monotone"
                  dataKey="piorAluno"
                  name="Resultado a melhorar"
                  stroke="#ef4444"
                  fill="#fca5a5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Frequência de Treinos */}
        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequência de Treinos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData.workoutFrequency}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {progressData.workoutFrequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Alcance de Metas */}
        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alcance de Metas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData.goalAchievement}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Bar dataKey="alcancado" name="Meta alcançada (%)" stackId="a" fill="#10b981" />
                <Bar dataKey="naoAlcancado" name="A alcançar (%)" stackId="a" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recomendações baseadas nos dados */}
      <div className="card bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Insights e Recomendações</h2>
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 border-l-4 border-primary-500 rounded">
            <h3 className="font-medium text-primary-800">Progresso geral</h3>
            <p className="text-primary-700 mt-1">
              Os alunos estão mostrando uma média de redução de 5% na gordura corporal nos últimos 6 meses, 
              indicando que os programas de treino estão produzindo resultados positivos.
            </p>
          </div>
          
          <div className="p-4 bg-warning-50 border-l-4 border-warning-500 rounded">
            <h3 className="font-medium text-warning-800">Área de atenção</h3>
            <p className="text-warning-700 mt-1">
              24% dos alunos estão frequentando a academia apenas 0-1 vez por semana. 
              Considere implementar um programa de engajamento para aumentar a frequência desses membros.
            </p>
          </div>
          
          <div className="p-4 bg-success-50 border-l-4 border-success-500 rounded">
            <h3 className="font-medium text-success-800">Pontos fortes</h3>
            <p className="text-success-700 mt-1">
              Os treinos de força possuem a maior taxa de alcance de metas (75%). 
              Os métodos utilizados podem ser adaptados para outras áreas de treinamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 