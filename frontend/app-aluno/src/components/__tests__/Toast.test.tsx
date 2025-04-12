import { render, screen, act } from '@testing-library/react';
import { Toast } from '../Toast';

jest.useFakeTimers();

describe('Toast', () => {
  it('deve renderizar a mensagem corretamente', () => {
    const message = 'Teste de mensagem';
    render(
      <Toast
        message={message}
        type="success"
        onClose={() => {}}
      />
    );

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('deve chamar onClose após o tempo definido', () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="Teste"
        type="success"
        onClose={onClose}
        duration={2000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar as classes corretas baseado no tipo', () => {
    const { rerender } = render(
      <Toast
        message="Teste"
        type="success"
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-green-500');

    rerender(
      <Toast
        message="Teste"
        type="error"
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-red-500');

    rerender(
      <Toast
        message="Teste"
        type="info"
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-blue-500');
  });

  it('deve ter atributos de acessibilidade corretos', () => {
    render(
      <Toast
        message="Teste"
        type="success"
        onClose={() => {}}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });
}); 