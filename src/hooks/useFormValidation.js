import { useState, useCallback } from 'react';

// Regras de validação
const validationRules = {
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0 || 'Este campo é obrigatório';
    }
    return value !== null && value !== undefined || 'Este campo é obrigatório';
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Email inválido';
  },
  
  minLength: (min) => (value) => {
    return value.length >= min || `Mínimo de ${min} caracteres`;
  },
  
  maxLength: (max) => (value) => {
    return value.length <= max || `Máximo de ${max} caracteres`;
  },
  
  futureDate: (value) => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today || 'Data deve ser futura';
  },
  
  url: (value) => {
    if (!value) return true; // URL é opcional
    try {
      new URL(value);
      return true;
    } catch {
      return 'URL inválida';
    }
  },
  
  phone: (value) => {
    if (!value) return true; // Telefone é opcional
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) || 'Telefone inválido';
  }
};

export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const fieldRules = validationSchema[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      let validator;
      let params = [];

      if (typeof rule === 'string') {
        validator = validationRules[rule];
      } else if (typeof rule === 'object') {
        const [ruleName, ...ruleParams] = Object.keys(rule);
        validator = validationRules[ruleName];
        params = rule[ruleName] ? [rule[ruleName]] : ruleParams;
      } else if (typeof rule === 'function') {
        validator = rule;
      }

      if (validator) {
        const result = params.length > 0 ? validator(...params)(value) : validator(value);
        if (result !== true) {
          return result;
        }
      }
    }
    return null;
  }, [validationSchema]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationSchema]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar campo em tempo real se já foi tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Marcar todos os campos como tocados
    const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const isValid = validateForm();
    
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erro no envio do formulário:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, validateForm, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    reset,
    setFieldValue,
    setFieldError,
    isValid: Object.keys(errors).length === 0
  };
};

export { validationRules };