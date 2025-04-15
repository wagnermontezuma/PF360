'use client';

import React, { useState } from 'react';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  screenshot?: File | null;
}

const BetaFeedbackForm: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'improvement',
    title: '',
    description: '',
    severity: 'medium',
    screenshot: null
  });

  // Se a feature flag de feedback beta não estiver ativada, não exibimos o formulário
  if (!flags.betaFeedback) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, screenshot: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Por favor, preencha o título e a descrição do feedback.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulação de envio para a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em produção, enviaríamos para uma API real
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback/beta`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     type: formData.type,
      //     title: formData.title,
      //     description: formData.description,
      //     severity: formData.type === 'bug' ? formData.severity : undefined,
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Falha ao enviar o feedback');
      
      // Resetar formulário após envio bem-sucedido
      setFormData({
        type: 'improvement',
        title: '',
        description: '',
        severity: 'medium',
        screenshot: null
      });
      
      setIsSuccess(true);
      
      // Esconder mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError('Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.');
      console.error('Erro ao enviar feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          BETA
        </span>
        <h2 className="text-xl font-bold">Enviar Feedback</h2>
      </div>
      
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 font-medium">
            Feedback enviado com sucesso! Agradecemos sua contribuição para melhorar a plataforma.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Feedback
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="improvement">Sugestão de Melhoria</option>
            <option value="bug">Relatar Problema</option>
            <option value="feature">Solicitação de Recurso</option>
            <option value="other">Outro</option>
          </select>
        </div>
        
        {formData.type === 'bug' && (
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
              Gravidade do Problema
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Baixa - Incômodo menor</option>
              <option value="medium">Média - Afeta algumas funcionalidades</option>
              <option value="high">Alta - Impede o uso de recursos importantes</option>
              <option value="critical">Crítica - Sistema inutilizável</option>
            </select>
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Título breve e descritivo"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            maxLength={100}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva em detalhes o problema ou sugestão"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-1">
            Captura de Tela (opcional)
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            accept="image/*"
          />
          <p className="mt-1 text-xs text-gray-500">
            Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
          </p>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 text-white font-medium rounded-md transition-colors 
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : 'Enviar Feedback'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Seu feedback é essencial para melhorarmos a Plataforma Fitness 360. 
          Todas as sugestões e relatos serão analisados pela nossa equipe.
        </p>
      </div>
    </div>
  );
};

export default BetaFeedbackForm; 