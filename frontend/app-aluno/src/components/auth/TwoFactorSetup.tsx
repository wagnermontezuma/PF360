import { FC, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface TwoFactorSetupProps {
    onComplete: () => void;
}

export const TwoFactorSetup: FC<TwoFactorSetupProps> = ({ onComplete }) => {
    const [step, setStep] = useState<'initial' | 'verify'>('initial');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const enable2FA = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/2fa/enable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setQrCode(data.qr_code);
            setSecret(data.secret);
            setStep('verify');
        } catch (error) {
            toast.error('Erro ao habilitar 2FA');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/2fa/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            toast.success('2FA habilitado com sucesso!');
            onComplete();
        } catch (error) {
            toast.error('Código inválido');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'initial') {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Configurar Autenticação em Dois Fatores</h2>
                <p className="mb-4 text-gray-600">
                    A autenticação em dois fatores adiciona uma camada extra de segurança à sua conta.
                    Você precisará de um aplicativo como Google Authenticator ou Authy.
                </p>
                <button
                    onClick={enable2FA}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Configurando...' : 'Começar Configuração'}
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Escaneie o Código QR</h2>
            <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <Image
                        src={qrCode}
                        alt="QR Code para 2FA"
                        width={200}
                        height={200}
                        className="rounded-lg"
                    />
                </div>
                <p className="text-sm text-gray-500 mb-2">Ou insira o código manualmente:</p>
                <code className="bg-gray-100 px-4 py-2 rounded text-sm font-mono mb-4">
                    {secret}
                </code>
            </div>
            <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Digite o código de 6 dígitos:
                </label>
                <input
                    type="text"
                    id="code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="000000"
                />
            </div>
            <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
                {loading ? 'Verificando...' : 'Verificar e Ativar'}
            </button>
        </div>
    );
}; 