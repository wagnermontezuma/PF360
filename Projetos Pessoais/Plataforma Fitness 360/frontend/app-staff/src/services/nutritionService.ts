import api from './api';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  category: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Array<{
    foodId: string;
    foodName: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  notes?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  memberId: string;
  memberName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  type: 'cutting' | 'bulking' | 'maintenance' | 'custom';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  weekdays: {
    [key: string]: { // 'monday', 'tuesday', etc.
      meals: Meal[];
      macros: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
    };
  };
  recommendations?: string;
  supplements?: Array<{
    name: string;
    dosage: string;
    timing: string;
    notes?: string;
  }>;
}

export interface DietPlanFilters {
  page?: number;
  limit?: number;
  memberId?: string;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FoodItemFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Função para obter lista de planos alimentares
export const getDietPlans = async (filters: DietPlanFilters = {}): Promise<{
  plans: DietPlan[];
  total: number;
  page: number;
  limit: number;
}> => {
  const response = await api.get('/api/staff/nutrition', { params: filters });
  return response.data;
};

// Função para obter detalhes de um plano alimentar específico
export const getDietPlanById = async (id: string): Promise<DietPlan> => {
  const response = await api.get(`/api/staff/nutrition/${id}`);
  return response.data;
};

// Função para criar um novo plano alimentar
export const createDietPlan = async (data: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DietPlan> => {
  const response = await api.post('/api/staff/nutrition', data);
  return response.data;
};

// Função para atualizar um plano alimentar existente
export const updateDietPlan = async (id: string, data: Partial<DietPlan>): Promise<DietPlan> => {
  const response = await api.put(`/api/staff/nutrition/${id}`, data);
  return response.data;
};

// Função para excluir um plano alimentar
export const deleteDietPlan = async (id: string): Promise<void> => {
  await api.delete(`/api/staff/nutrition/${id}`);
};

// Função para obter lista de alimentos
export const getFoodItems = async (filters: FoodItemFilters = {}): Promise<{
  foods: FoodItem[];
  total: number;
  page: number;
  limit: number;
}> => {
  const response = await api.get('/api/staff/nutrition/foods', { params: filters });
  return response.data;
};

// Função para obter detalhes de um alimento específico
export const getFoodItemById = async (id: string): Promise<FoodItem> => {
  const response = await api.get(`/api/staff/nutrition/foods/${id}`);
  return response.data;
};

// Função para criar um novo alimento
export const createFoodItem = async (data: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
  const response = await api.post('/api/staff/nutrition/foods', data);
  return response.data;
};

// Função para atualizar um alimento existente
export const updateFoodItem = async (id: string, data: Partial<FoodItem>): Promise<FoodItem> => {
  const response = await api.put(`/api/staff/nutrition/foods/${id}`, data);
  return response.data;
};

// Função para excluir um alimento
export const deleteFoodItem = async (id: string): Promise<void> => {
  await api.delete(`/api/staff/nutrition/foods/${id}`);
}; 