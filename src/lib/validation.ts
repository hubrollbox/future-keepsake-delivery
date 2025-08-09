
import { z } from 'zod';

// User input validation schemas
export const emailSchema = z.string()
  .email('Por favor, introduza um email válido')
  .min(1, 'Email é obrigatório')
  .max(255, 'Email demasiado longo')
  .transform(val => val.trim().toLowerCase());

export const passwordSchema = z.string()
  .min(6, 'A palavra-passe deve ter pelo menos 6 caracteres')
  .max(128, 'Palavra-passe demasiado longa')
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'A palavra-passe deve conter pelo menos uma letra e um número');

export const nameSchema = z.string()
  .min(1, 'Nome é obrigatório')
  .max(100, 'Nome demasiado longo')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
  .transform(val => val.trim());

export const messageSchema = z.string()
  .min(1, 'Mensagem é obrigatória')
  .max(5000, 'Mensagem demasiado longa')
  .transform(val => val.trim());

export const titleSchema = z.string()
  .min(1, 'Título é obrigatório')
  .max(200, 'Título demasiado longo')
  .transform(val => val.trim());

// Authentication form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Palavra-passe é obrigatória')
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema.optional(),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As palavras-passe não coincidem",
  path: ["confirmPassword"],
});

// Message creation schema
export const createMessageSchema = z.object({
  title: titleSchema,
  message_content: messageSchema,
  delivery_date: z.string().min(1, 'Data de entrega é obrigatória'),
  recipient_name: nameSchema.optional(),
  recipient_email: emailSchema.optional()
});

// Contact form schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: titleSchema,
  message: messageSchema
});

// Sanitization function to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const isRateLimited = (identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (userRequests.count >= maxRequests) {
    return true;
  }

  userRequests.count++;
  return false;
};
