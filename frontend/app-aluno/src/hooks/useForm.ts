import { useState, useCallback } from 'react';

type ValidationRule = {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: any) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value) {
      return 'Este campo é obrigatório';
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Mínimo de ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Máximo de ${rules.maxLength} caracteres`;
    }

    if (rules.min && Number(value) < rules.min) {
      return `Valor mínimo é ${rules.min}`;
    }

    if (rules.max && Number(value) > rules.max) {
      return `Valor máximo é ${rules.max}`;
    }

    if (rules.custom && !rules.custom(value)) {
      return 'Valor inválido';
    }

    return '';
  }, [validationRules]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      }
    }

    setIsSubmitting(false);
  }, [values, validateForm]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateForm
  };
} 