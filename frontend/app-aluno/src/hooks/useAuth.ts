'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('@Fitness360:token');
        
        if (token) {
            verifyToken();
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async () => {
        try {
            const token = localStorage.getItem('@Fitness360:token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(response.data);
        } catch (error) {
            signOut();
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            const { access_token, user: userData } = response.data;

            localStorage.setItem('@Fitness360:token', access_token);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(userData);
            toast.success('Login realizado com sucesso!');
            
            router.push('/dashboard');
        } catch (error) {
            toast.error('Credenciais inválidas');
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('@Fitness360:token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    requireAuth: boolean = true
) {
    return function WithAuthComponent(props: P) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading) {
                if (requireAuth && !user) {
                    router.replace('/login');
                } else if (!requireAuth && user) {
                    router.replace('/dashboard');
                }
            }
        }, [loading, user, router]);

        if (loading) {
            return <div>Carregando...</div>;
        }

        if (requireAuth && !user) {
            return null;
        }

        if (!requireAuth && user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
} 