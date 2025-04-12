import { useState, FormEvent } from 'react';
import { Loading } from '@/components/Loading';

interface TwoFactorVerifyProps {
    onVerify: (code: string) => Promise<void>;
    onCancel: () => void;
}

export function TwoFactorVerify({ onVerify, onCancel }: TwoFactorVerifyProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onVerify(code);
        } catch (error) {
            // Erro já tratado no useAuth
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verificação em Duas Etapas
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Digite o código enviado para seu dispositivo
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="code" className="sr-only">Código 2FA</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            required
                            maxLength={6}
                            pattern="[0-9]{6}"
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Digite o código de 6 dígitos"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Voltar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loading size="small" />
                            ) : (
                                'Verificar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 