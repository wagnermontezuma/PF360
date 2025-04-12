import api from './api';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  plan: string;
  profileImage?: string;
  measurements?: {
    height?: number;
    weight?: number;
    bodyFat?: number;
    lastUpdate?: string;
  };
}

export interface MembersResponse {
  members: Member[];
  total: number;
  page: number;
  limit: number;
}

export interface MemberFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  plan?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Função para obter lista de membros com paginação e filtros
export const getMembers = async (filters: MemberFilters = {}): Promise<MembersResponse> => {
  // Configurando a API temporariamente para o mock
  const response = await api.get('/api/staff/members', { params: filters });
  return response.data;
};

// Função para obter detalhes de um membro específico
export const getMemberById = async (id: string): Promise<Member> => {
  const response = await api.get(`/api/staff/members/${id}`);
  return response.data;
};

// Função para atualizar informações de um membro
export const updateMember = async (id: string, data: Partial<Member>): Promise<Member> => {
  const response = await api.put(`/api/staff/members/${id}`, data);
  return response.data;
};

// Função para criar um novo membro
export const createMember = async (data: Omit<Member, 'id'>): Promise<Member> => {
  const response = await api.post('/api/staff/members', data);
  return response.data;
};

// Função para obter métricas dos membros para o dashboard
export const getMemberMetrics = async (): Promise<{
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  retentionRate: number;
}> => {
  const response = await api.get('/api/staff/members/metrics');
  return response.data;
}; 