import { useState, useEffect, createContext, useContext } from 'react';

// Definição das feature flags disponíveis
export interface FeatureFlags {
  betaFeedback: boolean;
  improvementsSection: boolean;
  aiTrainingRecommendations: boolean;
  nutritionTracking: boolean;
  groupClasses: boolean;
  progressPictures: boolean;
  personalTrainerChat: boolean;
  challengeModule: boolean;
}

// Valores padrão (tudo desativado)
const defaultFlags: FeatureFlags = {
  betaFeedback: false,
  improvementsSection: false,
  aiTrainingRecommendations: false,
  nutritionTracking: false,
  groupClasses: false,
  progressPictures: false,
  personalTrainerChat: false,
  challengeModule: false,
};

// Contexto para disponibilizar as flags em toda a aplicação
export const FeatureFlagsContext = createContext<{
  flags: FeatureFlags;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
}>({
  flags: defaultFlags,
  isLoading: true,
  refreshFlags: async () => {},
});

// Prioridade de origem das flags:
// 1. Específicas do usuário (armazenadas no servidor)
// 2. Configuração do .env ou variáveis de ambiente
// 3. Padrão (todas desativadas)
export const FeatureFlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega as flags de ambiente (.env)
  const loadEnvFlags = (): Partial<FeatureFlags> => {
    const envFlags: Partial<FeatureFlags> = {};
    
    // Verifica se estamos no ambiente beta
    const isBetaEnv = process.env.NEXT_PUBLIC_ENV === 'beta';

    // Feature flags do .env
    if (process.env.NEXT_PUBLIC_BETA_FEEDBACK_ENABLED === 'true' || isBetaEnv) {
      envFlags.betaFeedback = true;
    }

    // Adicione outras flags conforme necessário
    if (process.env.NEXT_PUBLIC_IMPROVEMENTS_SECTION === 'true' || isBetaEnv) {
      envFlags.improvementsSection = true;
    }

    if (process.env.NEXT_PUBLIC_AI_TRAINING_ENABLED === 'true') {
      envFlags.aiTrainingRecommendations = true;
    }

    if (process.env.NEXT_PUBLIC_NUTRITION_TRACKING_ENABLED === 'true' || isBetaEnv) {
      envFlags.nutritionTracking = true;
    }

    return envFlags;
  };

  // Carrega as flags do servidor (específicas do usuário)
  const loadUserFlags = async (): Promise<Partial<FeatureFlags>> => {
    try {
      // Apenas se o usuário estiver autenticado
      const token = localStorage.getItem('token');
      if (!token) return {};

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/features`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return {};

      const data = await response.json();
      return data.features || {};
    } catch (error) {
      console.error('Erro ao carregar features do usuário:', error);
      return {};
    }
  };

  // Função para combinar flags de diferentes fontes
  const mergeFlags = (userFlags: Partial<FeatureFlags>, envFlags: Partial<FeatureFlags>): FeatureFlags => {
    return {
      ...defaultFlags,     // Valores padrão
      ...envFlags,         // Sobrescreve com valores do .env
      ...userFlags,        // Sobrescreve com valores do usuário
    };
  };

  // Função para atualizar as flags
  const refreshFlags = async () => {
    setIsLoading(true);
    
    // Carrega as flags do ambiente
    const envFlags = loadEnvFlags();
    
    // Carrega as flags específicas do usuário
    const userFlags = await loadUserFlags();
    
    // Combina as flags na ordem correta
    const combinedFlags = mergeFlags(userFlags, envFlags);
    
    setFlags(combinedFlags);
    setIsLoading(false);
  };

  // Carrega as flags ao iniciar
  useEffect(() => {
    refreshFlags();
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ flags, isLoading, refreshFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

// Hook para utilizar as feature flags
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  
  if (!context) {
    throw new Error('useFeatureFlags deve ser usado dentro de FeatureFlagsProvider');
  }
  
  return context;
};

export default useFeatureFlags; 