'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

// Tipo para as perguntas frequentes
interface FaqItem {
  question: string;
  answer: React.ReactNode;
  isOpen?: boolean;
}

export default function BetaFaqPage() {
  // Estado para controlar quais perguntas estão abertas
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      question: 'O que é o Programa Beta da Plataforma Fitness 360?',
      answer: (
        <p>
          O Programa Beta da Plataforma Fitness 360 é um ambiente de testes para novos 
          recursos e funcionalidades antes de seu lançamento oficial para todos os usuários. 
          Ao participar, você tem acesso antecipado a estas ferramentas e ajuda a aprimorá-las 
          com seu feedback.
        </p>
      ),
      isOpen: false
    },
    {
      question: 'Como fui selecionado para o Programa Beta?',
      answer: (
        <p>
          Os participantes do Programa Beta são selecionados com base em diversos critérios, 
          incluindo tempo de uso da plataforma, frequência de interações, feedback anteriores 
          e dados demográficos. Buscamos um grupo diversificado de usuários para termos 
          perspectivas variadas sobre os novos recursos.
        </p>
      ),
      isOpen: false
    },
    {
      question: 'Posso convidar outras pessoas para o Programa Beta?',
      answer: (
        <p>
          Atualmente, não oferecemos um programa de convites. A seleção é feita diretamente 
          pela nossa equipe com base em critérios específicos. No entanto, periodicamente 
          abrimos inscrições para novos testadores. Fique atento às notificações na plataforma.
        </p>
      ),
      isOpen: false
    },
    {
      question: 'Os recursos beta são estáveis e seguros?',
      answer: (
        <div>
          <p className="mb-2">
            Os recursos beta passaram por testes internos antes de serem disponibilizados, 
            mas ainda podem conter bugs ou comportamentos inesperados. Por isso:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Todos os seus dados importantes continuam protegidos</li>
            <li>As funcionalidades principais da plataforma não são afetadas</li>
            <li>Implementamos medidas para evitar problemas graves</li>
          </ul>
          <p className="mt-2">
            Se encontrar algum problema, por favor, reporte através do formulário de feedback.
          </p>
        </div>
      ),
      isOpen: false
    },
    {
      question: 'Por quanto tempo os recursos beta ficarão disponíveis?',
      answer: (
        <p>
          O período de teste beta varia para cada recurso, dependendo da complexidade e 
          do feedback recebido. Geralmente, os testes duram de 2 a 8 semanas. Após este 
          período, o recurso pode ser lançado oficialmente para todos os usuários, passar 
          por mais refinamentos ou, em alguns casos, ser descontinuado.
        </p>
      ),
      isOpen: false
    },
    {
      question: 'Como posso dar feedback sobre os recursos beta?',
      answer: (
        <div>
          <p className="mb-2">
            Existem várias maneiras de compartilhar sua opinião sobre os recursos beta:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use o <Link href="/beta/feedback" className="text-blue-600 underline">formulário de feedback</Link> dedicado</li>
            <li>Responda às pesquisas que enviamos periodicamente</li>
            <li>Participe das sessões de teste guiado quando convidado</li>
            <li>Entre em contato diretamente pelo e-mail beta@fitness360.com.br</li>
          </ul>
          <p className="mt-2">
            Todo feedback é valioso e analisado cuidadosamente pela nossa equipe.
          </p>
        </div>
      ),
      isOpen: false
    },
    {
      question: 'O que acontece se eu quiser sair do Programa Beta?',
      answer: (
        <p>
          Você pode optar por sair do Programa Beta a qualquer momento. Basta enviar 
          um e-mail para beta@fitness360.com.br solicitando sua remoção ou contatar 
          o suporte. Ao sair, você perderá o acesso aos recursos em teste, mas continuará 
          com acesso normal às funcionalidades padrão da plataforma.
        </p>
      ),
      isOpen: false
    }
  ]);

  // Função para alternar o estado de abertura de uma pergunta
  const toggleFaqItem = (index: number) => {
    setFaqItems(
      faqItems.map((item, i) => 
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link 
              href="/beta"
              className="mr-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
          </div>
          
          <p className="text-gray-600 mt-2">
            Respostas para as dúvidas mais comuns sobre o Programa Beta da Plataforma Fitness 360.
          </p>
        </div>
        
        <div className="space-y-4 mb-10">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaqItem(index)}
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {item.isOpen ? (
                  <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                )}
              </button>
              
              {item.isOpen && (
                <div className="px-6 py-4 bg-gray-50 text-gray-700">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">Ainda tem dúvidas?</h2>
          <p className="text-blue-700 mb-4">
            Se você não encontrou resposta para sua pergunta, entre em contato com 
            nossa equipe de suporte dedicada ao Programa Beta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/beta/feedback"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-center font-medium hover:bg-blue-700 transition-colors"
            >
              Enviar Feedback
            </Link>
            <a
              href="mailto:beta@fitness360.com.br"
              className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-center font-medium hover:bg-blue-50 transition-colors"
            >
              Contatar Suporte Beta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 