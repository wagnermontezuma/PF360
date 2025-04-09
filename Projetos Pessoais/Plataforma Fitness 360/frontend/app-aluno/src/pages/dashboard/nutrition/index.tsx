import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiPlus, FiPieChart, FiClock, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth';
import { DashboardCard } from '../../../components/DashboardCard';
import { Layout } from '../../../components/Layout';

interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface CalorieStats {
  dailyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  trend: 'up' | 'down' | 'stable';
}

const NutritionDashboard: React.FC = () => {
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [calorieStats, setCalorieStats] = useState<CalorieStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Define constantes de cores diretamente em vez de usar useColorModeValue
  const bgCard = "#1C1C1C";
  const borderColor = "#2A2A2A";
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Dados mockados para desenvolvimento
        setTimeout(() => {
          // Simular planos nutricionais
          const mockPlans: NutritionPlan[] = [
            {
              id: '1',
              name: 'Plano Emagrecimento',
              description: 'Plano focado na redução de gordura corporal com déficit calórico moderado',
              startDate: '2024-02-01',
              endDate: '2024-04-30',
              isActive: true,
              totalCalories: 1800,
              totalProtein: 150,
              totalCarbs: 130,
              totalFat: 60
            },
            {
              id: '2',
              name: 'Plano Ganho Muscular',
              description: 'Plano de alimentação com foco em hipertrofia e ganho de massa muscular',
              startDate: '2024-03-15',
              endDate: '2024-06-15',
              isActive: false,
              totalCalories: 2500,
              totalProtein: 200,
              totalCarbs: 250,
              totalFat: 70
            }
          ];
          
          // Simular estatísticas de calorias
          const mockStats: CalorieStats = {
            dailyAverage: 1950,
            weeklyTotal: 13650,
            monthlyTotal: 58500,
            trend: 'down'
          };
          
          setNutritionPlans(mockPlans);
          setCalorieStats(mockStats);
          setIsLoading(false);
        }, 1000);
        
        // Em produção, usaria:
        /*
        // Obter planos nutricionais
        const plansResponse = await axios.get('/api/nutrition/plans', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        
        // Obter estatísticas de calorias
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        
        const statsResponse = await axios.get('/api/nutrition/statistics', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          params: {
            startDate: oneMonthAgo.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0]
          }
        });
        
        setNutritionPlans(plansResponse.data);
        setCalorieStats(statsResponse.data);
        */
      } catch (error) {
        console.error('Erro ao carregar dados nutricionais:', error);
        setError('Falha ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, router, user]);
  
  const handleCreatePlan = () => {
    router.push('/dashboard/nutrition/create');
  };
  
  const handleViewPlan = (id: string) => {
    router.push(`/dashboard/nutrition/plan/${id}`);
  };
  
  const showErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6">
        <p>{error}</p>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text">Dashboard Nutricional</h1>
            <p className="text-gray-light mt-1">Acompanhe sua nutrição e planos alimentares</p>
          </div>
          <button 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors"
            onClick={handleCreatePlan}
          >
            <FiPlus className="h-4 w-4" />
            <span>Novo Plano</span>
          </button>
        </div>
        
        {showErrorMessage()}
        
        {/* Métricas de Nutrição */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Calorias Diárias"
            value={calorieStats?.dailyAverage || 0}
            unit="kcal"
            icon={<FiPieChart className="h-5 w-5 text-primary" />}
            isLoading={isLoading}
          />
          <DashboardCard 
            title="Total Semanal"
            value={calorieStats?.weeklyTotal || 0}
            unit="kcal"
            icon={<FiClock className="h-5 w-5 text-accent" />}
            isLoading={isLoading}
          />
          <DashboardCard 
            title="Tendência"
            value={calorieStats?.trend === 'up' ? 'Aumento' : calorieStats?.trend === 'down' ? 'Redução' : 'Estável'}
            unit=""
            icon={<FiTrendingUp className="h-5 w-5 text-success" />}
            isLoading={isLoading}
            status={calorieStats?.trend === 'up' ? 'warning' : calorieStats?.trend === 'down' ? 'success' : 'info'}
          />
        </div>
        
        {/* Lista de Planos Nutricionais */}
        <h2 className="text-xl font-semibold text-text mb-4">Meus Planos Nutricionais</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div 
                key={i}
                className="h-52 bg-[#1C1C1C] rounded-2xl p-5 opacity-60 animate-pulse"
              />
            ))}
          </div>
        ) : nutritionPlans.length === 0 ? (
          <div className="p-8 text-center border border-[#2A2A2A] bg-[#1C1C1C] rounded-2xl">
            <p className="text-gray-light mb-4">Você ainda não possui planos nutricionais</p>
            <button 
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors"
              onClick={handleCreatePlan}
            >
              <FiPlus className="h-4 w-4" />
              <span>Criar Primeiro Plano</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nutritionPlans.map((plan) => (
              <div 
                key={plan.id}
                className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-primary/50 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all transform hover:scale-[1.02] duration-200"
                onClick={() => handleViewPlan(plan.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-text">{plan.name}</h3>
                  {plan.isActive && (
                    <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-light line-clamp-2 mb-3">
                  {plan.description}
                </p>
                
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div>
                    <p className="text-xs text-gray-light">Calorias</p>
                    <p className="font-medium text-text font-display">{plan.totalCalories} <span className="text-xs">kcal</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-light">Proteínas</p>
                    <p className="font-medium text-text font-display">{plan.totalProtein}<span className="text-xs">g</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-light">Carbos</p>
                    <p className="font-medium text-text font-display">{plan.totalCarbs}<span className="text-xs">g</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-light">Gorduras</p>
                    <p className="font-medium text-text font-display">{plan.totalFat}<span className="text-xs">g</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NutritionDashboard; 