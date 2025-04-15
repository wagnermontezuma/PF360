'use client';

import BetaFeedbackForm from '@/components/BetaFeedbackForm';

export const metadata = {
  title: 'Feedback Beta - Fitness 360',
  description: 'Envie seu feedback sobre os recursos beta da Plataforma Fitness 360',
};

export default function BetaFeedbackPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feedback Beta</h1>
          <p className="text-gray-600">
            Sua opinião é muito importante para melhorarmos a plataforma.
            Compartilhe sua experiência com os recursos beta e ajude-nos a aprimorá-los.
          </p>
        </div>
        
        <BetaFeedbackForm />
        
        <div className="mt-10 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Sobre o Programa Beta</h2>
          <p className="mb-4">
            O Programa Beta da Plataforma Fitness 360 permite que usuários selecionados 
            testem novos recursos antes do lançamento oficial. Como participante, você tem 
            acesso antecipado a funcionalidades inovadoras.
          </p>
          <p className="mb-4">
            Sua participação ativa enviando feedback é fundamental para identificarmos 
            problemas e aprimorarmos a experiência de todos os usuários.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-2">Recursos Beta Ativos</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Recomendações de treino por inteligência artificial</li>
            <li>Acompanhamento nutricional avançado</li>
            <li>Aulas em grupo online</li>
            <li>Fotos de progresso com análise comparativa</li>
          </ul>
          <p className="text-sm text-blue-600 mt-4">
            Dúvidas sobre o programa beta? Entre em contato com nossa equipe em 
            <a href="mailto:beta@fitness360.com.br" className="underline ml-1">
              beta@fitness360.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 