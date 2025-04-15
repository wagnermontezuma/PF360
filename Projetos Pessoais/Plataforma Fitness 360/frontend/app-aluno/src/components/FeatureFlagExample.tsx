import React from 'react';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

// Componente que demonstra o uso de feature flags para exibir conteúdo condicionalmente
const FeatureFlagExample: React.FC = () => {
  const { flags, isLoading } = useFeatureFlags();

  // Aguardar o carregamento das feature flags
  if (isLoading) {
    return (
      <div className="p-4 rounded-md bg-gray-100">
        <p className="text-gray-500">Carregando recursos disponíveis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recursos Disponíveis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feedback Beta */}
        {flags.betaFeedback && (
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Feedback Beta</h3>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                NOVO
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Sua opinião é importante para melhorarmos a plataforma. Compartilhe suas impressões sobre os novos recursos.
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Enviar feedback
            </button>
          </div>
        )}

        {/* Recomendações de IA */}
        {flags.aiTrainingRecommendations && (
          <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recomendações com IA</h3>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                BETA
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Receba recomendações personalizadas de treino baseadas em seu histórico e objetivos.
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
              Ver recomendações
            </button>
          </div>
        )}

        {/* Acompanhamento Nutricional */}
        {flags.nutritionTracking && (
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Acompanhamento Nutricional</h3>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                BETA
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Monitore sua dieta, macronutrientes e receba orientações personalizadas.
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              Meu plano nutricional
            </button>
          </div>
        )}

        {/* Chat com Personal */}
        {flags.personalTrainerChat && (
          <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Chat com Personal</h3>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                NOVO
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Converse diretamente com seu personal trainer para esclarecer dúvidas.
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
              Iniciar conversa
            </button>
          </div>
        )}
      </div>

      {/* Mensagem quando não há recursos beta disponíveis */}
      {!flags.betaFeedback && 
       !flags.aiTrainingRecommendations && 
       !flags.nutritionTracking && 
       !flags.personalTrainerChat && (
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-gray-600">
            Você ainda não tem acesso a recursos beta. Fique atento às novidades!
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureFlagExample; 