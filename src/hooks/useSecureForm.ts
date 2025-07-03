
import { useState, useCallback } from 'react';
import { validateField, sanitizeInput, ValidationRule, RateLimiter } from '@/utils/inputValidation';

interface FormField {
  value: string;
  rules: ValidationRule;
  errors: string[];
}

interface UseSecureFormOptions {
  rateLimit?: {
    maxAttempts: number;
    windowMs: number;
  };
}

export const useSecureForm = <T extends Record<string, any>>(
  initialFields: Record<keyof T, ValidationRule>,
  options: UseSecureFormOptions = {}
) => {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFieldState: Record<keyof T, FormField> = {} as any;
    
    Object.keys(initialFields).forEach((key) => {
      initialFieldState[key as keyof T] = {
        value: '',
        rules: initialFields[key as keyof T],
        errors: []
      };
    });
    
    return initialFieldState;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const rateLimiter = new RateLimiter();

  const updateField = useCallback((fieldName: keyof T, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value: sanitizedValue,
        errors: []
      }
    }));
  }, []);

  const validateForm = useCallback(() => {
    let isValid = true;
    const updatedFields = { ...fields };

    Object.keys(fields).forEach((key) => {
      const fieldKey = key as keyof T;
      const field = fields[fieldKey];
      const validation = validateField(field.value, String(fieldKey), field.rules);
      
      updatedFields[fieldKey] = {
        ...field,
        errors: validation.errors
      };

      if (!validation.isValid) {
        isValid = false;
      }
    });

    setFields(updatedFields);
    return isValid;
  }, [fields]);

  const getFieldValue = useCallback((fieldName: keyof T): string => {
    return fields[fieldName]?.value || '';
  }, [fields]);

  const getFieldErrors = useCallback((fieldName: keyof T): string[] => {
    return fields[fieldName]?.errors || [];
  }, [fields]);

  const getAllValues = useCallback((): Partial<T> => {
    const values: Partial<T> = {};
    
    Object.keys(fields).forEach((key) => {
      const fieldKey = key as keyof T;
      values[fieldKey] = fields[fieldKey].value as any;
    });
    
    return values;
  }, [fields]);

  const resetForm = useCallback(() => {
    const resetFields: Record<keyof T, FormField> = {} as any;
    
    Object.keys(fields).forEach((key) => {
      const fieldKey = key as keyof T;
      resetFields[fieldKey] = {
        value: '',
        rules: fields[fieldKey].rules,
        errors: []
      };
    });
    
    setFields(resetFields);
  }, [fields]);

  const checkRateLimit = useCallback((identifier: string = 'default') => {
    if (!options.rateLimit) return true;
    
    return rateLimiter.isAllowed(
      identifier,
      options.rateLimit.maxAttempts,
      options.rateLimit.windowMs
    );
  }, [options.rateLimit, rateLimiter]);

  const submitForm = useCallback(async (
    onSubmit: (values: Partial<T>) => Promise<void>,
    identifier: string = 'default'
  ) => {
    if (isSubmitting) return false;

    // Check rate limit
    if (!checkRateLimit(identifier)) {
      throw new Error('Muitas tentativas. Tente novamente mais tarde.');
    }

    // Validate form
    if (!validateForm()) {
      throw new Error('Por favor, corrija os erros no formulário.');
    }

    setIsSubmitting(true);

    try {
      const values = getAllValues();
      await onSubmit(values);
      resetForm();
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, checkRateLimit, validateForm, getAllValues, resetForm]);

  return {
    updateField,
    validateForm,
    getFieldValue,
    getFieldErrors,
    getAllValues,
    resetForm,
    submitForm,
    isSubmitting,
    checkRateLimit
  };
};
