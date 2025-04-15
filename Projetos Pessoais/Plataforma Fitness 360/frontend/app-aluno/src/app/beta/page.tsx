'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  AlertTriangle, 
  Lightbulb, 
  BarChart, 
  Activity,
  HelpCircle,
  ChevronRight 
} from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import BetaBanner from '@/components/BetaBanner';

export const metadata = {
  title: 'Programa Beta - Fitness 360',
  description: 'Acesso às funcionalidades beta da Plataforma Fitness 360',
};

export default function BetaIndexPage() {
  const router = useRouter();
  const { flags, isLoading } = useFeatureFlags();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se o usuário não tem acesso a nenhum recurso beta, redireciona para o dashboard
  if (!flags.BETA_ACCESS) {
    router.push('/dashboard');
    return null;
  }

  // Calcula quantos recursos beta estão ativos para o usuário
  const activeFeatureCount = Object.entries(flags).filter(
    ([key, value]) => key.startsWith('BETA_') && value === true
  ).length - 1; // Subtrai 1 para não contar BETA_ACCESS

  return (
    <div className="container mx-auto py-10 px-4">
      <BetaBanner />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Programa Beta</h1>
        <p className="text-gray-600 mb-8">
          Você tem acesso antecipado a {activeFeatureCount} recursos em fase de teste. 
          Explore as novas funcionalidades e compartilhe sua opinião.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link 
            href="/beta/feedback"
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Enviar Feedback</h2>
                <p className="text-gray-600">Compartilhe sua opinião sobre os novos recursos</p>
              </div>
            </div>
            <div className="flex justify-end">
              <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>

          <Link 
            href="/beta/questoes"
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <HelpCircle className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Perguntas Frequentes</h2>
                <p className="text-gray-600">Respostas para as dúvidas mais comuns sobre o programa beta</p>
              </div>
            </div>
            <div className="flex justify-end">
              <ChevronRight className="text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Recursos Beta Ativos</h2>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          {flags.BETA_ADVANCED_METRICS && (
            <div className="p-6 border-b border-gray-200 flex items-start">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <BarChart className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Métricas Avançadas</h3>
                <p className="text-gray-600 mb-3">
                  Visualize estatísticas detalhadas sobre seu progresso, incluindo análises de tendências e comparações personalizadas.
                </p>
                <Link 
                  href="/metricas" 
                  className="text-green-600 font-medium inline-flex items-center hover:underline"
                >
                  Explorar métricas <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          )}

          {flags.BETA_WORKOUT_RECOMMENDATIONS && (
            <div className="p-6 border-b border-gray-200 flex items-start">
              <div className="p-2 bg-orange-100 rounded-lg mr-4">
                <Activity className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Recomendações Inteligentes de Treino</h3>
                <p className="text-gray-600 mb-3">
                  Receba sugestões personalizadas de treinos com base no seu histórico, objetivos e disponibilidade.
                </p>
                <Link 
                  href="/treinos/recomendacoes" 
                  className="text-orange-600 font-medium inline-flex items-center hover:underline"
                >
                  Ver recomendações <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          )}

          {flags.BETA_NUTRITION_AI && (
            <div className="p-6 border-b border-gray-200 flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Lightbulb className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Assistente de Nutrição IA</h3>
                <p className="text-gray-600 mb-3">
                  Converse com nossa inteligência artificial para obter dicas nutricionais e esclarecimento de dúvidas.
                </p>
                <Link 
                  href="/nutricao/assistente" 
                  className="text-blue-600 font-medium inline-flex items-center hover:underline"
                >
                  Conversar com assistente <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          )}

          {!flags.BETA_ADVANCED_METRICS && !flags.BETA_WORKOUT_RECOMMENDATIONS && !flags.BETA_NUTRITION_AI && (
            <div className="p-6 flex items-start">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Nenhum recurso ativo no momento</h3>
                <p className="text-gray-600">
                  Você tem acesso ao programa Beta, mas não há recursos específicos habilitados para você neste momento. 
                  Novos recursos serão disponibilizados em breve.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Sobre o Programa Beta</h2>
          <p className="text-gray-700 mb-4">
            O Programa Beta da Plataforma Fitness 360 permite que usuários selecionados experimentem recursos em 
            desenvolvimento antes do lançamento oficial. Sua opinião é fundamental para aprimorarmos estas funcionalidades.
          </p>
          <p className="text-gray-700 mb-4">
            Durante este período de testes, você poderá encontrar comportamentos inesperados ou pequenos bugs. 
            Todos os problemas reportados são analisados pela nossa equipe de desenvolvimento.
          </p>
          <div className="flex justify-end">
            <Link 
              href="/beta/questoes"
              className="text-blue-600 font-medium inline-flex items-center hover:underline"
            >
              Ver perguntas frequentes <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 