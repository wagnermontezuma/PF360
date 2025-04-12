import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: {
        id: number;
        name: string;
        email: string;
    };
    access_token: string;
    token_type: string;
}

const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('user');
        axios.post(`${API_URL}/auth/logout`).catch(() => {
            // Ignora erros no logout
        });
    },

    async refreshToken(): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/refresh`);
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    getCurrentUser(): AuthResponse | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    getAuthHeader(): { Authorization?: string } {
        const user = this.getCurrentUser();
        if (user?.access_token) {
            return { Authorization: `Bearer ${user.access_token}` };
        }
        return {};
    },
};

// Configurando interceptor para adicionar token em todas as requisições
axios.interceptors.request.use(
    (config) => {
        const headers = authService.getAuthHeader();
        if (headers.Authorization) {
            config.headers.Authorization = headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratamento de erros de autenticação
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await authService.refreshToken();
                const headers = authService.getAuthHeader();
                originalRequest.headers.Authorization = headers.Authorization;
                return axios(originalRequest);
            } catch (err) {
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default authService; 