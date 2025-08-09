
import { z } from "zod";

// Enhanced validation schemas with security considerations
export const secureEmailSchema = z
  .string()
  .email("Email inválido")
  .min(1, "Email é obrigatório")
  .max(254, "Email demasiado longo")
  .refine((email) => {
    // Additional security checks
    const domainPart = email.split('@')[1];
    return domainPart && domainPart.length > 0 && !domainPart.includes('..');
  }, "Formato de email inválido");

export const securePasswordSchema = z
  .string()
  .min(8, "Password deve ter pelo menos 8 caracteres")
  .max(128, "Password demasiado longa")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password deve conter pelo menos uma letra minúscula, uma maiúscula e um número");

export const secureNameSchema = z
  .string()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome demasiado longo")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome contém caracteres inválidos")
  .refine((name) => name.trim().length > 0, "Nome não pode estar vazio");

export const securePhoneSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone) return true;
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  }, "Número de telefone inválido");

export const secureMessageSchema = z
  .string()
  .min(1, "Mensagem é obrigatória")
  .max(5000, "Mensagem demasiado longa")
  .refine((message) => {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(message));
  }, "Mensagem contém conteúdo não permitido");

export const secureTitleSchema = z
  .string()
  .min(1, "Título é obrigatório")
  .max(200, "Título demasiado longo")
  .refine((title) => title.trim().length > 0, "Título não pode estar vazio");

// Sanitization helper functions
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
};
