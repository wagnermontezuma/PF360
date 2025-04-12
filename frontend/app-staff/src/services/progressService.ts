import api from './api';

export interface MemberProgress {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  measurements: {
    weight?: number;
    height?: number;
    bodyFat?: number;
    bodyWater?: number;
    muscleMass?: number;
    boneMass?: number;
    chestCircumference?: number;
    waistCircumference?: number;
    hipCircumference?: number;
    bicepsCircumference?: number;
    thighCircumference?: number;
    calfCircumference?: number;
  };
  photos?: {
    front?: string;
    side?: string;
    back?: string;
  };
  notes?: string;
}

export interface ProgressFilters {
  page?: number;
  limit?: number;
  memberId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProgressMetric {
  label: string;
  data: Array<{
    date: string;
    value: number;
  }>;
}

export interface PerformanceMetric {
  exercise: string;
  data: Array<{
    date: string;
    weight: number;
    reps: number;
  }>;
}

// Função para obter lista de registros de progresso
export const getProgressHistory = async (filters: ProgressFilters = {}): Promise<{
  records: MemberProgress[];
  total: number;
  page: number;
  limit: number;
}> => {
  const response = await api.get('/api/staff/progress', { params: filters });
  return response.data;
};

// Função para obter detalhes de um registro específico
export const getProgressById = async (id: string): Promise<MemberProgress> => {
  const response = await api.get(`/api/staff/progress/${id}`);
  return response.data;
};

// Função para adicionar um novo registro de progresso
export const createProgress = async (data: Omit<MemberProgress, 'id'>): Promise<MemberProgress> => {
  const response = await api.post('/api/staff/progress', data);
  return response.data;
};

// Função para atualizar um registro de progresso
export const updateProgress = async (id: string, data: Partial<MemberProgress>): Promise<MemberProgress> => {
  const response = await api.put(`/api/staff/progress/${id}`, data);
  return response.data;
};

// Função para excluir um registro de progresso
export const deleteProgress = async (id: string): Promise<void> => {
  await api.delete(`/api/staff/progress/${id}`);
};

// Função para obter métricas de progresso de um membro específico
export const getMemberProgressMetrics = async (memberId: string, metric: string, period: string): Promise<ProgressMetric> => {
  const response = await api.get(`/api/staff/progress/metrics/${memberId}`, {
    params: { metric, period }
  });
  return response.data;
};

// Função para obter métricas de desempenho em exercícios específicos
export const getExercisePerformance = async (memberId: string, exerciseId: string, period: string): Promise<PerformanceMetric> => {
  const response = await api.get(`/api/staff/progress/performance/${memberId}`, {
    params: { exerciseId, period }
  });
  return response.data;
};

// Função para gerar relatório de progresso PDF
export const generateProgressReport = async (memberId: string, startDate: string, endDate: string): Promise<Blob> => {
  const response = await api.get(`/api/staff/progress/report/${memberId}`, {
    params: { startDate, endDate },
    responseType: 'blob'
  });
  return response.data;
}; 