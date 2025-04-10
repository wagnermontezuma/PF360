import axios from 'axios';
import { parseCookies } from 'nookies';
import toast from 'react-hot-toast';

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const { 'fitness360.token': token } = parseCookies();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro do servidor (status 4xx, 5xx)
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        // Erro de autenticação - token expirado ou inválido
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          toast.error('Sua sessão expirou. Por favor, faça login novamente.');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        // Erro de autorização - permissão negada
        toast.error('Você não tem permissão para acessar este recurso.');
      } else if (status === 404) {
        // Recurso não encontrado
        toast.error('Recurso não encontrado.');
      } else if (status === 422) {
        // Erro de validação
        toast.error(data.message || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (status >= 500) {
        // Erro interno do servidor
        toast.error('Ocorreu um erro no servidor. Tente novamente mais tarde.');
      } else {
        // Outros erros
        toast.error(data.message || 'Ocorreu um erro. Tente novamente.');
      }
    } else if (error.request) {
      // Sem resposta do servidor
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      toast.error('Ocorreu um erro na solicitação. Tente novamente.');
    }
    
    return Promise.reject(error);
  }
);

// Serviços de API
export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  refreshToken: async (refreshToken: string) => {
    return api.post('/auth/refresh-token', { refreshToken });
  },
  logout: async () => {
    return api.post('/auth/logout');
  },
};

export const membersService = {
  getMembers: async (page = 1, limit = 10) => {
    return axios.get(`${process.env.NEXT_PUBLIC_MEMBERS_API_URL}/api/staff/members`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getMemberById: async (id: string) => {
    return axios.get(`${process.env.NEXT_PUBLIC_MEMBERS_API_URL}/api/staff/members/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

export const workoutsService = {
  getWorkouts: async (page = 1, limit = 10) => {
    return axios.get(`${process.env.NEXT_PUBLIC_WORKOUTS_API_URL}/api/staff/workouts`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getWorkoutById: async (id: string) => {
    return axios.get(`${process.env.NEXT_PUBLIC_WORKOUTS_API_URL}/api/staff/workouts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

export const nutritionService = {
  getNutritionPlans: async (page = 1, limit = 10) => {
    return axios.get(`${process.env.NEXT_PUBLIC_NUTRITION_API_URL}/api/staff/nutrition`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getNutritionPlanById: async (id: string) => {
    return axios.get(`${process.env.NEXT_PUBLIC_NUTRITION_API_URL}/api/staff/nutrition/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

export const progressService = {
  getMemberProgress: async (memberId: string) => {
    return axios.get(`${process.env.NEXT_PUBLIC_MEMBERS_API_URL}/api/staff/progress/${memberId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getOverviewStats: async () => {
    return axios.get(`${process.env.NEXT_PUBLIC_MEMBERS_API_URL}/api/staff/progress`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

export default api; 