import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Loading } from '../Loading';

describe('Loading', () => {
  it('deve renderizar o spinner de carregamento', () => {
    render(<Loading />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('deve aplicar a classe de tamanho correto', () => {
    const { rerender } = render(<Loading size="small" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('w-4 h-4');

    rerender(<Loading size="medium" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('w-8 h-8');

    rerender(<Loading size="large" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('w-12 h-12');
  });

  it('deve renderizar em tela cheia quando fullScreen é true', () => {
    render(<Loading fullScreen />);
    const container = screen.getByRole('status');
    expect(container).toHaveClass('fixed inset-0 flex items-center justify-center bg-gray-900/50');
  });

  it('deve ter o texto de acessibilidade correto', () => {
    render(<Loading />);
    expect(screen.getByLabelText('Carregando...')).toBeInTheDocument();
  });
}); 