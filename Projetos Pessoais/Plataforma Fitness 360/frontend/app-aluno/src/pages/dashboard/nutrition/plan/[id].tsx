import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiEdit2, FiCalendar, FiClock, FiInfo, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../../../hooks/useAuth';
import { Layout } from '../../../../components/Layout';

interface Food {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
}

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
  meals: Meal[];
}

// Dados mockados para desenvolvimento
const MOCK_PLAN: NutritionPlan = {
  id: '1',
  name: 'Plano Emagrecimento',
  description: 'Plano focado na redução de gordura corporal com déficit calórico moderado. Desenvolvido especialmente para suas necessidades e objetivos, com foco em alimentos nutritivos e baixos em calorias.',
  startDate: '2024-02-01',
  endDate: '2024-04-30',
  isActive: true,
  totalCalories: 1800,
  totalProtein: 150,
  totalCarbs: 130,
  totalFat: 60,
  meals: [
    {
      id: '101',
      name: 'Café da Manhã',
      time: '07:00',
      foods: [
        { id: '1001', name: 'Ovos mexidos', quantity: 100, calories: 150, protein: 12, carbs: 2, fats: 10 },
        { id: '1002', name: 'Torrada integral', quantity: 60, calories: 120, protein: 5, carbs: 22, fats: 2 },
        { id: '1003', name: 'Abacate', quantity: 50, calories: 80, protein: 1, carbs: 4, fats: 8 }
      ]
    },
    {
      id: '102',
      name: 'Lanche da Manhã',
      time: '10:00',
      foods: [
        { id: '1004', name: 'Iogurte natural', quantity: 200, calories: 120, protein: 10, carbs: 9, fats: 5 },
        { id: '1005', name: 'Banana', quantity: 100, calories: 90, protein: 1, carbs: 23, fats: 0 }
      ]
    },
    {
      id: '103',
      name: 'Almoço',
      time: '13:00',
      foods: [
        { id: '1006', name: 'Frango grelhado', quantity: 150, calories: 250, protein: 40, carbs: 0, fats: 8 },
        { id: '1007', name: 'Arroz integral', quantity: 100, calories: 180, protein: 4, carbs: 35, fats: 2 },
        { id: '1008', name: 'Brócolis', quantity: 100, calories: 55, protein: 3, carbs: 11, fats: 0 },
        { id: '1009', name: 'Azeite', quantity: 10, calories: 90, protein: 0, carbs: 0, fats: 10 }
      ]
    },
    {
      id: '104',
      name: 'Lanche da Tarde',
      time: '16:00',
      foods: [
        { id: '1010', name: 'Whey protein', quantity: 30, calories: 120, protein: 24, carbs: 3, fats: 2 },
        { id: '1011', name: 'Frutas vermelhas', quantity: 100, calories: 70, protein: 1, carbs: 17, fats: 0 }
      ]
    },
    {
      id: '105',
      name: 'Jantar',
      time: '20:00',
      foods: [
        { id: '1012', name: 'Salmão', quantity: 150, calories: 280, protein: 30, carbs: 0, fats: 18 },
        { id: '1013', name: 'Batata doce', quantity: 150, calories: 165, protein: 2, carbs: 37, fats: 0 },
        { id: '1014', name: 'Aspargos', quantity: 100, calories: 30, protein: 3, carbs: 6, fats: 0 }
      ]
    }
  ]
};

const NutritionPlanDetail: React.FC = () => {
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (id) {
      const fetchPlan = async () => {
        try {
          setIsLoading(true);
          
          // Simulando chamada à API
          setTimeout(() => {
            setPlan(MOCK_PLAN);
            setIsLoading(false);
          }, 1000);
          
          // Em um cenário real:
          // const token = localStorage.getItem('token');
          // const response = await fetch(`http://localhost:3003/nutrition/plans/${id}`, {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // const data = await response.json();
          // setPlan(data);
          
        } catch (error) {
          console.error('Erro ao carregar plano nutricional:', error);
          setIsLoading(false);
        }
      };
      
      fetchPlan();
    }
  }, [id, isAuthenticated, router]);
  
  const handleGoBack = () => {
    router.push('/dashboard/nutrition');
  };
  
  const handleEdit = () => {
    router.push(`/dashboard/nutrition/plan/${id}/edit`);
  };
  
  // Função para calcular totais de uma refeição
  const getMealTotals = (meal: Meal) => {
    return meal.foods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fats: acc.fats + food.fats
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  return (
    <Layout>
      <div className="p-4 space-y-8">
        {/* Cabeçalho com botão de voltar */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            <span>Voltar</span>
          </button>
          
          {!isLoading && (
            <button 
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiEdit2 className="h-4 w-4" />
              <span>Editar Plano</span>
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-800 animate-pulse rounded-lg w-1/2"></div>
            <div className="h-24 bg-gray-800 animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-800 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : plan ? (
          <>
            {/* Informações do plano */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{plan.name}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(plan.startDate).toLocaleDateString('pt-BR')} até {new Date(plan.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {plan.isActive && (
                  <span className="px-2 py-1 bg-green-900/40 text-green-500 text-xs font-medium rounded-full">
                    Ativo
                  </span>
                )}
              </div>
              
              <div className="bg-gray-800/70 rounded-xl p-6 mb-8">
                <h3 className="flex items-center text-gray-300 font-medium mb-2">
                  <FiInfo className="h-4 w-4 mr-2" />
                  <span>Sobre este plano</span>
                </h3>
                <p className="text-gray-400">{plan.description}</p>
              </div>
              
              {/* Macronutrientes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Calorias Diárias</p>
                  <p className="text-white text-2xl font-bold">{plan.totalCalories} <span className="text-sm font-normal">kcal</span></p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Proteínas</p>
                  <p className="text-white text-2xl font-bold">{plan.totalProtein} <span className="text-sm font-normal">g</span></p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Carboidratos</p>
                  <p className="text-white text-2xl font-bold">{plan.totalCarbs} <span className="text-sm font-normal">g</span></p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Gorduras</p>
                  <p className="text-white text-2xl font-bold">{plan.totalFat} <span className="text-sm font-normal">g</span></p>
                </div>
              </div>
            </div>
            
            {/* Refeições */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Refeições</h2>
              
              {plan.meals.map((meal) => {
                const totals = getMealTotals(meal);
                
                return (
                  <div key={meal.id} className="bg-gray-800/70 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between bg-gray-800 p-4">
                      <div>
                        <h3 className="text-white font-medium">{meal.name}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <FiClock className="h-3 w-3 mr-1" />
                          <span>{meal.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{totals.calories} kcal</p>
                        <p className="text-gray-400 text-xs">
                          P: {totals.protein}g | C: {totals.carbs}g | G: {totals.fats}g
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                            <th className="pb-2">Alimento</th>
                            <th className="pb-2 text-right">Qtd.</th>
                            <th className="pb-2 text-right">Calorias</th>
                            <th className="pb-2 text-right">P</th>
                            <th className="pb-2 text-right">C</th>
                            <th className="pb-2 text-right">G</th>
                          </tr>
                        </thead>
                        <tbody>
                          {meal.foods.map((food) => (
                            <tr key={food.id} className="border-b border-gray-700/50 text-sm">
                              <td className="py-3 text-white">{food.name}</td>
                              <td className="py-3 text-right text-gray-400">{food.quantity}g</td>
                              <td className="py-3 text-right text-gray-400">{food.calories} kcal</td>
                              <td className="py-3 text-right text-gray-400">{food.protein}g</td>
                              <td className="py-3 text-right text-gray-400">{food.carbs}g</td>
                              <td className="py-3 text-right text-gray-400">{food.fats}g</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-xl">
            <p>Plano nutricional não encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NutritionPlanDetail; 