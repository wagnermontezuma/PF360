import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils/test-wrapper';
import { useRouter } from 'next/router';
import WorkoutsList from '../index';
import { useAuth } from '../../../../hooks/useAuth';

// Mock dos hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../../../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('WorkoutsList', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve redirecionar para login se não estiver autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(<WorkoutsList />);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('deve renderizar a lista de treinos corretamente', () => {
    render(<WorkoutsList />);
    
    // Verifica o título
    expect(screen.getByText('Meus Treinos')).toBeInTheDocument();
    
    // Verifica os treinos mockados
    expect(screen.getByText('Treino A - Superior')).toBeInTheDocument();
    expect(screen.getByText('Treino B - Inferior')).toBeInTheDocument();
    
    // Verifica as descrições
    expect(screen.getByText('Foco em peito, ombros e tríceps')).toBeInTheDocument();
    expect(screen.getByText('Foco em pernas e glúteos')).toBeInTheDocument();
  });

  it('deve navegar para a página de novo treino ao clicar no botão', () => {
    render(<WorkoutsList />);
    const novoTreinoButton = screen.getByText('Novo Treino');
    fireEvent.click(novoTreinoButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/workouts/new');
  });

  it('deve navegar para os detalhes do treino ao clicar em Ver Detalhes', () => {
    render(<WorkoutsList />);
    const verDetalhesButtons = screen.getAllByText('Ver Detalhes');
    fireEvent.click(verDetalhesButtons[0]);
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/workouts/1');
  });

  it('deve navegar para iniciar o treino ao clicar em Iniciar', () => {
    render(<WorkoutsList />);
    const iniciarButtons = screen.getAllByText('Iniciar');
    fireEvent.click(iniciarButtons[0]);
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/workouts/1/start');
  });

  it('deve mostrar mensagem quando não há treinos', () => {
    // Renderiza o componente com uma lista vazia
    render(<WorkoutsList initialWorkouts={[]} />);
    
    expect(screen.getByText('Você ainda não tem nenhum treino cadastrado.')).toBeInTheDocument();
    expect(screen.getByText('Criar meu primeiro treino')).toBeInTheDocument();
  });

  it('deve mostrar o número correto de exercícios em cada treino', () => {
    render(<WorkoutsList />);
    const treinoASuperior = screen.getByText('Treino A - Superior').closest('div');
    const treinoBInferior = screen.getByText('Treino B - Inferior').closest('div');

    expect(treinoASuperior).toHaveTextContent('Exercícios: 3');
    expect(treinoBInferior).toHaveTextContent('Exercícios: 3');
  });
}); 