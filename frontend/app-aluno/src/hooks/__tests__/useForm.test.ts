import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm', () => {
  it('deve inicializar com os valores corretos', () => {
    const initialValues = { nome: '', email: '' };
    const validationRules = {
      nome: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    };

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('deve validar campos obrigatórios', () => {
    const initialValues = { nome: '', email: '' };
    const validationRules = {
      nome: { required: true },
      email: { required: true }
    };

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toEqual({
      nome: 'Este campo é obrigatório',
      email: 'Este campo é obrigatório'
    });
  });

  it('deve validar o formato de email', () => {
    const initialValues = { email: 'email-invalido' };
    const validationRules = {
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    };

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.email).toBe('Formato inválido');
  });

  it('deve atualizar valores e validar ao chamar handleChange', () => {
    const initialValues = { nome: '' };
    const validationRules = {
      nome: { required: true, minLength: 3 }
    };

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    act(() => {
      result.current.handleChange('nome', 'Ab');
    });

    expect(result.current.values.nome).toBe('Ab');
    expect(result.current.errors.nome).toBe('Mínimo de 3 caracteres');
  });

  it('deve validar comprimento mínimo e máximo', () => {
    const initialValues = { senha: '' };
    const validationRules = {
      senha: { minLength: 6, maxLength: 12 }
    };

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    act(() => {
      result.current.handleChange('senha', '12345');
    });
    expect(result.current.errors.senha).toBe('Mínimo de 6 caracteres');

    act(() => {
      result.current.handleChange('senha', '123456789012345');
    });
    expect(result.current.errors.senha).toBe('Máximo de 12 caracteres');
  });

  it('deve chamar onSubmit apenas se a validação passar', async () => {
    const initialValues = { nome: 'João', email: 'joao@email.com' };
    const validationRules = {
      nome: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    };
    const onSubmit = jest.fn();

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    await act(async () => {
      await result.current.handleSubmit(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalledWith(initialValues);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('não deve chamar onSubmit se a validação falhar', async () => {
    const initialValues = { nome: '', email: 'email-invalido' };
    const validationRules = {
      nome: { required: true },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    };
    const onSubmit = jest.fn();

    const { result } = renderHook(() => useForm(initialValues, validationRules));

    await act(async () => {
      await result.current.handleSubmit(onSubmit);
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors).toHaveProperty('nome');
    expect(result.current.errors).toHaveProperty('email');
  });
}); 