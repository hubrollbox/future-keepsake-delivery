import { z } from 'zod';
import { isValidPostalCode, sanitizeInput } from '@/utils/validation';

// ============================================================================
// ESQUEMAS DE VALIDAÇÃO MELHORADOS
// ============================================================================

// Esquema de validação para o título com sanitização
export const titleSchema = z.string()
  .min(1, 'O título é obrigatório')
  .transform(val => sanitizeInput(val.trim()))
  .refine(title => title.length >= 5, 'O título deve ter pelo menos 5 caracteres')
  .refine(title => title.length <= 100, 'O título não pode exceder 100 caracteres')
  .refine(title => {
    const words = title.split(/\s+/).filter(word => word.length > 0);
    return words.length >= 2;
  }, 'O título deve conter pelo menos 2 palavras');

// Esquema de validação para a mensagem com análise de conteúdo
export const messageSchema = z.string()
  .min(1, 'A mensagem é obrigatória')
  .transform(val => sanitizeInput(val.trim()))
  .refine(message => message.length >= 10, 'A mensagem deve ter pelo menos 10 caracteres')
  .refine(message => message.length <= 2000, 'A mensagem não pode exceder 2000 caracteres')
  .refine(message => {
    const words = message.split(/\s+/).filter(word => word.length > 0);
    return words.length >= 3;
  }, 'A mensagem deve conter pelo menos 3 palavras')
  .refine(message => {
    // Verificar se não é apenas caracteres repetidos
    const uniqueChars = new Set(message.replace(/\s/g, '').toLowerCase());
    return uniqueChars.size >= 5;
  }, 'A mensagem deve ser mais variada e significativa');

// Esquema de validação para a data de entrega com validações avançadas
export const deliveryDateSchema = z.string()
  .min(1, 'A data de entrega é obrigatória')
  .refine(date => {
    if (!date) return false;
    const deliveryDate = new Date(date);
    return !isNaN(deliveryDate.getTime());
  }, { message: 'Data inválida' })
  .refine(date => {
    const deliveryDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deliveryDate > today;
  }, { message: 'A data de entrega deve ser no futuro' })
  .refine(date => {
    const deliveryDate = new Date(date);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 50); // Máximo 50 anos no futuro
    return deliveryDate <= maxDate;
  }, { message: 'A data de entrega não pode ser superior a 50 anos no futuro' })
  .refine(date => {
    const deliveryDate = new Date(date);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1); // Mínimo amanhã
    return deliveryDate >= minDate;
  }, { message: 'A data de entrega deve ser pelo menos amanhã' });

// Esquema de validação para o nome do destinatário com validações culturais
export const recipientNameSchema = z.string()
  .min(1, 'O nome do destinatário é obrigatório')
  .transform(val => val.trim())
  .refine(name => name.length >= 2, 'O nome deve ter pelo menos 2 caracteres')
  .refine(name => name.length <= 100, 'O nome não pode exceder 100 caracteres')
  .refine(name => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name), 'O nome contém caracteres inválidos')
  .refine(name => {
    const words = name.split(/\s+/).filter(word => word.length > 0);
    return words.length >= 1 && words.every(word => word.length >= 2);
  }, 'Cada parte do nome deve ter pelo menos 2 caracteres')
  .refine(name => !/^\s*$/.test(name), 'O nome não pode conter apenas espaços')
  .transform(name => {
    // Capitalizar primeira letra de cada palavra
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

// Esquema de validação para email com verificações avançadas
export const emailSchema = z.string()
  .min(1, 'Email é obrigatório')
  .trim()
  .email('Por favor, introduza um email válido')
  .transform(val => val.toLowerCase())
  .refine(email => email.length <= 255, 'Email demasiado longo')
  .refine(email => {
    // Verificar domínios suspeitos ou temporários
    const suspiciousDomains = ['tempmail', '10minutemail', 'guerrillamail', 'mailinator'];
    return !suspiciousDomains.some(domain => email.includes(domain));
  }, 'Por favor, use um email permanente')
  .refine(email => {
    // Verificar se tem pelo menos um ponto no domínio
    const domain = email.split('@')[1];
    return domain && domain.includes('.');
  }, 'Domínio de email inválido');

// Esquema de validação para telefone com formatos internacionais
export const phoneSchema = z.string()
  .min(1, 'Número de telefone é obrigatório')
  .transform(val => val.trim())
  .refine(phone => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 9;
  }, 'O número de telefone deve ter pelo menos 9 dígitos')
  .refine(phone => {
    const digits = phone.replace(/\D/g, '');
    return digits.length <= 15;
  }, 'O número de telefone não pode ter mais de 15 dígitos')
  .refine(phone => {
    // Aceitar formatos: +351 123 456 789, 123456789, +351123456789, etc.
    return /^(\+?[0-9]{1,4}[\s-]?)?[0-9\s()-]{8,14}$/.test(phone);
  }, 'Formato de telefone inválido')
  .transform(phone => {
    // Normalizar formato do telefone
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('351') && digits.length === 12) {
      return `+${digits}`;
    } else if (digits.length === 9 && !phone.startsWith('+')) {
      return `+351${digits}`;
    }
    return phone;
  });

// Esquema de validação para código postal português melhorado
export const postalCodeSchema = z.string()
  .min(1, 'O código postal é obrigatório')
  .transform(val => val.trim())
  .refine(code => isValidPostalCode(code), 'Código postal inválido (formato: 0000-000)')
  .refine(code => {
    // Verificar se não é um código postal obviamente falso
    const numbers = code.replace('-', '');
    return !/^0{7}$|^1{7}$|^9{7}$/.test(numbers);
  }, 'Código postal inválido');

// Esquema de validação para cidade com verificações geográficas
export const citySchema = z.string()
  .min(1, 'A cidade é obrigatória')
  .transform(val => val.trim())
  .refine(city => city.length >= 2, 'A cidade deve ter pelo menos 2 caracteres')
  .refine(city => city.length <= 100, 'A cidade não pode exceder 100 caracteres')
  .refine(city => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(city), 'A cidade contém caracteres inválidos')
  .transform(city => {
    // Capitalizar primeira letra de cada palavra
    return city.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

// Esquema de validação para rua/morada com validações detalhadas
export const streetSchema = z.string()
  .min(1, 'A morada é obrigatória')
  .transform(val => val.trim())
  .refine(street => street.length >= 5, 'A morada deve ter pelo menos 5 caracteres')
  .refine(street => street.length <= 200, 'A morada não pode exceder 200 caracteres')
  .refine(street => {
    // Deve conter pelo menos um número ou palavra indicativa de morada
    return /\d/.test(street) || /rua|avenida|travessa|largo|praça|estrada/i.test(street);
  }, 'A morada deve incluir o nome da rua e número')
  .transform(street => {
    // Capitalizar primeira letra de cada palavra importante
    return street.replace(/\b\w+/g, word => {
      const lowerWord = word.toLowerCase();
      if (['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no'].includes(lowerWord)) {
        return lowerWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  });

// Esquema de validação para estado/distrito
export const stateSchema = z.string()
  .transform(val => val ? val.trim() : '')
  .refine(state => !state || state.length <= 100, 'O distrito não pode exceder 100 caracteres')
  .optional();

// Esquema de validação para país
export const countrySchema = z.string()
  .default('Portugal')
  .transform(val => val.trim())
  .refine(country => country.length >= 2, 'O país deve ter pelo menos 2 caracteres')
  .refine(country => country.length <= 100, 'O país não pode exceder 100 caracteres')
  .refine(country => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(country), 'O país contém caracteres inválidos');

// Esquema de validação para relacionamento
export const relationshipSchema = z.string()
  .transform(val => val ? val.trim() : '')
  .refine(rel => !rel || rel.length <= 50, 'O relacionamento não pode exceder 50 caracteres')
  .optional();

// Esquemas para tipos enum
export const keepsakeTypeSchema = z.enum(['digital', 'physical'], {
  errorMap: () => ({ message: 'Selecione um tipo válido de cápsula' }),
});

export const deliveryChannelSchema = z.enum(['email', 'sms', 'physical'], {
  errorMap: () => ({ message: 'Selecione um canal de entrega válido' }),
});

// ============================================================================
// ESQUEMA PRINCIPAL DO FORMULÁRIO - VERSÃO MELHORADA
// ============================================================================

export const keepsakeFormSchema = z.object({
  // Campos obrigatórios principais
  title: titleSchema,
  message: messageSchema,
  delivery_date: deliveryDateSchema,
  type: keepsakeTypeSchema,
  recipient_name: recipientNameSchema,
  delivery_channel: deliveryChannelSchema,
  
  // Campos opcionais
  relationship: relationshipSchema,
  
  // Campos de custo e produtos
  channel_cost: z.number().min(0, 'Custo do canal deve ser positivo').default(0),
  selected_products: z.array(
    z.object({
      id: z.string().min(1, 'ID do produto é obrigatório'),
      name: z.string().min(1, 'Nome do produto é obrigatório'),
      price: z.number().min(0, 'Preço deve ser positivo'),
      quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1')
    })
  ).default([]),
  total_cost: z.number().min(0, 'Custo total deve ser positivo').default(0),
  
  // Campos condicionais
  recipient_contact: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
})
.superRefine((data, ctx) => {
  // Validação condicional melhorada
  if (data.delivery_channel === 'email') {
    if (!data.recipient_contact) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email do destinatário é obrigatório',
        path: ['recipient_contact']
      });
    } else if (!emailSchema.safeParse(data.recipient_contact).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email inválido',
        path: ['recipient_contact']
      });
    }
  }
  
  if (data.delivery_channel === 'sms') {
    if (!data.recipient_contact) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de telefone é obrigatório',
        path: ['recipient_contact']
      });
    } else if (!phoneSchema.safeParse(data.recipient_contact).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de telefone inválido',
        path: ['recipient_contact']
      });
    }
  }
  
  if (data.delivery_channel === 'physical') {
    if (!data.street) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Morada é obrigatória',
        path: ['street']
      });
    }
    if (!data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cidade é obrigatória',
        path: ['city']
      });
    }
    if (!data.postal_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Código postal é obrigatório',
        path: ['postal_code']
      });
    }
  }
});

// ============================================================================
// TIPOS E ESQUEMAS AUXILIARES
// ============================================================================

// Tipo inferido do esquema principal
export type KeepsakeFormValues = z.infer<typeof keepsakeFormSchema>;

// Esquema para validação por etapas
export const stepValidationSchemas = {
  type: z.object({ type: keepsakeTypeSchema }),
  recipient: z.object({
    recipient_name: recipientNameSchema,
    delivery_channel: deliveryChannelSchema,
    relationship: relationshipSchema,
  }),
  message: z.object({
    title: titleSchema,
    message: messageSchema,
    delivery_date: deliveryDateSchema,
  }),
  products: z.object({
    selected_products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().min(0),
      quantity: z.number().int().min(1)
    })).default([]),
    channel_cost: z.number().min(0).default(0),
    total_cost: z.number().min(0).default(0),
  }),
};

// Esquema de validação para edição de keepsake melhorado
export const editKeepsakeSchema = z.object({
  title: titleSchema,
  content: messageSchema,
  delivery_date: deliveryDateSchema,
  recipient_email: emailSchema.nullable().optional(),
  recipient_phone: phoneSchema.nullable().optional(),
  status: z.enum(['scheduled', 'sent', 'delivered', 'failed']).optional(),
  notes: z.string().max(500, 'Notas não podem exceder 500 caracteres').optional(),
});

// Tipo inferido do esquema de edição
export type EditKeepsakeFormValues = z.infer<typeof editKeepsakeSchema>;

// ============================================================================
// FUNÇÕES UTILITÁRIAS DE VALIDAÇÃO
// ============================================================================

// Função para validar um passo específico
export const validateStep = (step: keyof typeof stepValidationSchemas, data: unknown) => {
  return stepValidationSchemas[step].safeParse(data);
};

// Função para obter mensagens de erro amigáveis
export const getFieldError = (errors: Record<string, unknown>, fieldPath: string): string | undefined => {
  const pathArray = fieldPath.split('.');
  let current: any = errors;
  
  for (const path of pathArray) {
    if (current && typeof current === 'object' && path in current) {
      current = current[path];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'object' && current !== null && 'message' in current ? (current as { message?: string }).message : undefined;
};

// Função para validar dados condicionais
export const validateConditionalFields = (data: Partial<KeepsakeFormValues>) => {
  const errors: Record<string, string> = {};
  
  if (data.delivery_channel === 'email' && !data.recipient_contact) {
    errors.recipient_contact = 'Email é obrigatório para entrega por email';
  }
  
  if (data.delivery_channel === 'sms' && !data.recipient_contact) {
    errors.recipient_contact = 'Telefone é obrigatório para entrega por SMS';
  }
  
  if (data.delivery_channel === 'physical') {
    if (!data.street) errors.street = 'Morada é obrigatória para entrega física';
    if (!data.city) errors.city = 'Cidade é obrigatória para entrega física';
    if (!data.postal_code) errors.postal_code = 'Código postal é obrigatório para entrega física';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export default keepsakeFormSchema;