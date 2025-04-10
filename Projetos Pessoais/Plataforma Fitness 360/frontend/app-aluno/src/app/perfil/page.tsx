'use client';

import { useEffect, useState } from 'react';
import { AuthLayout } from '@/components/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  joinedAt: string;
  planType: string;
  lastLogin: string;
}

export default function PerfilPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    height: '',
    weight: '',
    fitnessGoal: ''
  });

  useEffect(() => {
    // Simular carregamento de dados do perfil
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: user?.id || '123',
        name: user?.name || 'Usuário Teste',
        email: user?.email || 'usuario@email.com',
        phone: '(11) 98765-4321',
        birthdate: '1990-05-15',
        height: 175,
        weight: 70,
        fitnessGoal: 'Hipertrofia',
        joinedAt: '2023-05-10',
        planType: 'Premium',
        lastLogin: new Date().toISOString()
      };
      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        email: mockProfile.email,
        phone: mockProfile.phone || '',
        birthdate: mockProfile.birthdate || '',
        height: mockProfile.height?.toString() || '',
        weight: mockProfile.weight?.toString() || '',
        fitnessGoal: mockProfile.fitnessGoal || ''
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de atualização do perfil
    setLoading(true);
    setTimeout(() => {
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birthdate: formData.birthdate,
          height: parseFloat(formData.height) || prev.height,
          weight: parseFloat(formData.weight) || prev.weight,
          fitnessGoal: formData.fitnessGoal
        };
      });
      setEditing(false);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Meu Perfil</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {profile && !editing ? (
          <div className="bg-gray-800 rounded-lg p-5 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/4 mb-6 sm:mb-0 sm:pr-6">
                <div className="bg-gray-700 rounded-full h-32 w-32 mx-auto sm:mx-0 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">{profile.name.charAt(0)}</span>
                </div>
                <div className="mt-4 text-center sm:text-left">
                  <p className="text-white font-semibold">{profile.planType}</p>
                  <p className="text-gray-400 text-sm">Cliente desde {new Date(profile.joinedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="sm:w-3/4 space-y-6 divide-y divide-gray-700">
                <div className="space-y-2">
                  <h2 className="text-xl text-blue-500 font-semibold">Informações Pessoais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Nome</p>
                      <p className="text-white">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Telefone</p>
                      <p className="text-white">{profile.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Data de Nascimento</p>
                      <p className="text-white">
                        {profile.birthdate 
                          ? new Date(profile.birthdate).toLocaleDateString('pt-BR') 
                          : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-2">
                  <h2 className="text-xl text-blue-500 font-semibold">Medidas e Objetivos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400">Altura</p>
                      <p className="text-white">{profile.height ? `${profile.height} cm` : 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Peso</p>
                      <p className="text-white">{profile.weight ? `${profile.weight} kg` : 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Objetivo Principal</p>
                      <p className="text-white">{profile.fitnessGoal || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-2">
                  <h2 className="text-xl text-blue-500 font-semibold">Atividade da Conta</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Último acesso</p>
                      <p className="text-white">{new Date(profile.lastLogin).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">ID do usuário</p>
                      <p className="text-white text-sm font-mono">{profile.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-1">Objetivo Principal</label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="">Selecione um objetivo</option>
                    <option value="Emagrecimento">Emagrecimento</option>
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Condicionamento">Condicionamento Físico</option>
                    <option value="Saúde">Saúde e Bem-estar</option>
                    <option value="Reabilitação">Reabilitação</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditing(false)} 
                  className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthLayout>
  );
} 