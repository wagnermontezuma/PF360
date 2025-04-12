import api from './api';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup: string;
  sets: number;
  reps: string; // Ex: "12-15" ou "Até a falha"
  rest: string; // Ex: "60s" ou "90s"
  videoUrl?: string;
  imageUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  type: 'A' | 'B' | 'C' | 'D' | 'FBW' | 'custom';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // Em minutos
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  memberId: string;
  memberName: string;
  workouts: Workout[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutFilters {
  page?: number;
  limit?: number;
  type?: string;
  level?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WorkoutPlanFilters {
  page?: number;
  limit?: number;
  memberId?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Função para obter lista de treinos
export const getWorkouts = async (filters: WorkoutFilters = {}): Promise<{
  workouts: Workout[];
  total: number;
  page: number;
  limit: number;
}> => {
  const response = await api.get('/api/staff/workouts', { params: filters });
  return response.data;
};

// Função para obter detalhes de um treino específico
export const getWorkoutById = async (id: string): Promise<Workout> => {
  const response = await api.get(`/api/staff/workouts/${id}`);
  return response.data;
};

// Função para criar um novo treino
export const createWorkout = async (data: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> => {
  const response = await api.post('/api/staff/workouts', data);
  return response.data;
};

// Função para atualizar um treino existente
export const updateWorkout = async (id: string, data: Partial<Workout>): Promise<Workout> => {
  const response = await api.put(`/api/staff/workouts/${id}`, data);
  return response.data;
};

// Função para excluir um treino
export const deleteWorkout = async (id: string): Promise<void> => {
  await api.delete(`/api/staff/workouts/${id}`);
};

// Função para obter lista de planos de treino
export const getWorkoutPlans = async (filters: WorkoutPlanFilters = {}): Promise<{
  plans: WorkoutPlan[];
  total: number;
  page: number;
  limit: number;
}> => {
  const response = await api.get('/api/staff/workout-plans', { params: filters });
  return response.data;
};

// Função para obter detalhes de um plano de treino específico
export const getWorkoutPlanById = async (id: string): Promise<WorkoutPlan> => {
  const response = await api.get(`/api/staff/workout-plans/${id}`);
  return response.data;
};

// Função para criar um novo plano de treino
export const createWorkoutPlan = async (data: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutPlan> => {
  const response = await api.post('/api/staff/workout-plans', data);
  return response.data;
};

// Função para atualizar um plano de treino existente
export const updateWorkoutPlan = async (id: string, data: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
  const response = await api.put(`/api/staff/workout-plans/${id}`, data);
  return response.data;
};

// Função para excluir um plano de treino
export const deleteWorkoutPlan = async (id: string): Promise<void> => {
  await api.delete(`/api/staff/workout-plans/${id}`);
}; 