'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, X, Check, Users, Filter } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type FeatureFlags = {
  betaFeedback: boolean;
  improvementsSection: boolean;
  aiTrainingRecommendations: boolean;
  nutritionTracking: boolean;
  groupClasses: boolean;
  progressPictures: boolean;
  personalTrainerChat: boolean;
  challengeModule: boolean;
};

type UserFeatureFlags = {
  userId: string;
  user: User;
  features: FeatureFlags;
};

const FeatureFlagsPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserFeatureFlags[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, enabled, disabled
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Os grupos de usuários para o beta
  const groups = [
    { id: 'group-a', name: 'Grupo A - Treino e Monitoramento' },
    { id: 'group-b', name: 'Grupo B - Nutrição e Dieta' },
    { id: 'group-c', name: 'Grupo C - Usuários Experientes' },
    { id: 'group-d', name: 'Grupo D - Iniciantes' },
  ];

  // Carregar usuários e suas feature flags
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Em produção, isso seria uma chamada à API real
        // Por enquanto, usamos dados mockados
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados de exemplo
        const mockUsers: UserFeatureFlags[] = [
          {
            userId: '1',
            user: { id: '1', name: 'Ana Silva', email: 'ana@example.com', role: 'STUDENT' },
            features: {
              betaFeedback: true,
              improvementsSection: true,
              aiTrainingRecommendations: false,
              nutritionTracking: true,
              groupClasses: false,
              progressPictures: false,
              personalTrainerChat: false,
              challengeModule: false,
            }
          },
          {
            userId: '2',
            user: { id: '2', name: 'Bruno Oliveira', email: 'bruno@example.com', role: 'STUDENT' },
            features: {
              betaFeedback: true,
              improvementsSection: true,
              aiTrainingRecommendations: true,
              nutritionTracking: false,
              groupClasses: false,
              progressPictures: true,
              personalTrainerChat: false,
              challengeModule: false,
            }
          },
          {
            userId: '3',
            user: { id: '3', name: 'Carla Mendes', email: 'carla@example.com', role: 'STUDENT' },
            features: {
              betaFeedback: true,
              improvementsSection: false,
              aiTrainingRecommendations: false,
              nutritionTracking: false,
              groupClasses: false,
              progressPictures: false,
              personalTrainerChat: false,
              challengeModule: false,
            }
          },
          {
            userId: '4',
            user: { id: '4', name: 'Daniel Costa', email: 'daniel@example.com', role: 'INSTRUCTOR' },
            features: {
              betaFeedback: true,
              improvementsSection: true,
              aiTrainingRecommendations: true,
              nutritionTracking: true,
              groupClasses: true,
              progressPictures: true,
              personalTrainerChat: true,
              challengeModule: true,
            }
          },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Função para alternar uma feature flag
  const toggleFeatureFlag = async (userId: string, featureKey: keyof FeatureFlags) => {
    // Em produção, isso seria uma chamada à API real para atualizar a flag
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.userId === userId) {
          return {
            ...user,
            features: {
              ...user.features,
              [featureKey]: !user.features[featureKey]
            }
          };
        }
        return user;
      })
    );
  };

  // Função para aplicar feature flags para um grupo
  const applyFlagsToGroup = (groupId: string) => {
    // Aqui definiríamos quais flags ativar com base no grupo
    let flags: Partial<FeatureFlags> = {};
    
    // Definição dos recursos para cada grupo
    if (groupId === 'group-a') {
      flags = {
        betaFeedback: true,
        improvementsSection: true,
        aiTrainingRecommendations: true,
      };
    } else if (groupId === 'group-b') {
      flags = {
        betaFeedback: true,
        improvementsSection: true,
        nutritionTracking: true,
      };
    } else if (groupId === 'group-c') {
      flags = {
        betaFeedback: true,
        improvementsSection: true,
        aiTrainingRecommendations: true,
        groupClasses: true,
      };
    } else if (groupId === 'group-d') {
      flags = {
        betaFeedback: true,
        improvementsSection: true,
        nutritionTracking: true,
        progressPictures: true,
      };
    }
    
    // Atualizar usuários selecionados (simulação)
    // Em produção, isso atualizaria no backend
    setUsers(prevUsers => 
      prevUsers.map((user, index) => {
        // Só atualizamos alguns usuários para simulação
        if ((groupId === 'group-a' && index % 4 === 0) ||
            (groupId === 'group-b' && index % 4 === 1) ||
            (groupId === 'group-c' && index % 4 === 2) ||
            (groupId === 'group-d' && index % 4 === 3)) {
          return {
            ...user,
            features: {
              ...user.features,
              ...flags
            }
          };
        }
        return user;
      })
    );
  };

  // Filtrar usuários com base na pesquisa e filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    
    const hasEnabledFlags = Object.values(user.features).some(flag => flag);
    
    if (filter === 'enabled') return matchesSearch && hasEnabledFlags;
    if (filter === 'disabled') return matchesSearch && !hasEnabledFlags;
    
    return matchesSearch;
  });

  // Definir o cabeçalho da tabela
  const featureFlagHeaders: {key: keyof FeatureFlags, label: string}[] = [
    { key: 'betaFeedback', label: 'Feedback Beta' },
    { key: 'improvementsSection', label: 'Seção Melhorias' },
    { key: 'aiTrainingRecommendations', label: 'IA Treino' },
    { key: 'nutritionTracking', label: 'Nutrição' },
    { key: 'groupClasses', label: 'Aulas em Grupo' },
    { key: 'progressPictures', label: 'Fotos Progresso' },
    { key: 'personalTrainerChat', label: 'Chat Personal' },
    { key: 'challengeModule', label: 'Desafios' },
  ];

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Gerenciamento de Feature Flags</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <h2 className="text-lg font-medium mb-3">Aplicar por Grupo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Selecione um grupo de usuários para aplicar configurações de feature flags predefinidas.
        </p>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => {
                setSelectedGroup(group.id);
                applyFlagsToGroup(group.id);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                selectedGroup === group.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users size={16} className="mr-2" />
              {group.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome ou email"
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <Filter size={18} className="mr-2 text-gray-500" />
              <select
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos usuários</option>
                <option value="enabled">Com feature flags</option>
                <option value="disabled">Sem feature flags</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Carregando usuários...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                    Usuário
                  </th>
                  {featureFlagHeaders.map(header => (
                    <th 
                      key={header.key}
                      scope="col" 
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(userFeature => (
                  <tr key={userFeature.userId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {userFeature.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userFeature.user.email}
                          </div>
                          <div className="text-xs mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              userFeature.user.role === 'INSTRUCTOR' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userFeature.user.role === 'INSTRUCTOR' ? 'Instrutor' : 'Aluno'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {featureFlagHeaders.map(header => (
                      <td key={`${userFeature.userId}-${header.key}`} className="px-3 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleFeatureFlag(userFeature.userId, header.key)}
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            userFeature.features[header.key]
                              ? 'bg-green-100 text-green-600 focus:ring-green-500'
                              : 'bg-red-100 text-red-600 focus:ring-red-500'
                          }`}
                        >
                          {userFeature.features[header.key] ? (
                            <Check size={14} />
                          ) : (
                            <X size={14} />
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagsPage; 