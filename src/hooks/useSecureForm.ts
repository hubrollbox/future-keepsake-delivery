
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { sanitizeInput } from '@/components/auth/SecureInputValidation';

interface UseSecureFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  sanitizeFields?: (keyof T)[];
}

export function useSecureForm<T extends Record<string, unknown>>({
  schema,
  onSubmit,
  sanitizeFields = []
}: UseSecureFormOptions<T>) {
  const [data, setData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    // Sanitize input if field is in sanitizeFields array
    const sanitizedValue = sanitizeFields.includes(field) && typeof value === 'string'
      ? sanitizeInput(value)
      : value;

    setData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors, sanitizeFields]);

  const getFieldValue = useCallback((field: keyof T) => {
    return data[field] || '';
  }, [data]);

  const getFieldErrors = useCallback((field: keyof T) => {
    const error = errors[field];
    return error ? [error] : [];
  }, [errors]);

  const validateField = useCallback((field: keyof T, value: T[keyof T]) => {
    try {
      // For single field validation, we'll try to validate the entire object
      // but only show errors for the specific field
      const testData = { ...data, [field]: value };
      schema.parse(testData);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((e: z.ZodIssue) => e.path.includes(field as string));
        if (fieldError) {
          setErrors(prev => ({ ...prev, [field]: fieldError.message }));
        }
      }
      return false;
    }
  }, [schema, data]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Validate all data
      const validatedData = schema.parse(data);
      
      // Submit the validated data
      await onSubmit(validatedData);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof T;
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Form submission error:', error);
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [data, schema, onSubmit]);

  const submitForm = useCallback(async (submitHandler: (data: T) => Promise<void>) => {
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Validate all data
      const validatedData = schema.parse(data);
      
      // Submit the validated data
      await submitHandler(validatedData);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof T;
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Form submission error:', error);
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [data, schema]);

  const reset = useCallback(() => {
    setData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    getFieldValue,
    getFieldErrors,
    validateField,
    handleSubmit,
    submitForm,
    reset,
    isValid: Object.keys(errors).length === 0 && Object.keys(data).length > 0
  };
}
