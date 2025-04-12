import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/Loading';
import { TwoFactorVerify } from '@/components/auth/TwoFactorVerify';
import { toast } from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const { signIn, verify2FA } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { requires2FA } = await signIn(email, password);
            if (requires2FA) {
                setShow2FA(true);
                toast.success('Por favor, insira o código de verificação');
            }
        } catch (error) {
            // Erro já tratado no useAuth
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async (code: string) => {
        try {
            await verify2FA(code);
        } catch (error) {
            setShow2FA(true); // Mantém o componente 2FA visível em caso de erro
        }
    };

    const handleCancel2FA = () => {
        setShow2FA(false);
        setPassword(''); // Limpa a senha por segurança
        toast.success('Verificação em duas etapas cancelada');
    };

    if (show2FA) {
        return (
            <TwoFactorVerify 
                onVerify={handleVerify2FA}
                onCancel={handleCancel2FA}
            />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Faça seu login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Entre com suas credenciais para acessar sua conta
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            aria-label={loading ? 'Carregando...' : 'Entrar'}
                        >
                            {loading ? (
                                <Loading size="small" />
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 