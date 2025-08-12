
import { z } from 'zod';

// Validação de email melhorada com mais verificações de segurança
export const emailSchema = z.string()
  .email('Por favor, introduza um email válido')
  .min(1, 'Email é obrigatório')
  .max(254, 'Email muito longo')
  .refine((email) => {
    // Validação adicional para domínios suspeitos
    const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
    const domain = email.split('@')[1];
    return !suspiciousDomains.includes(domain);
  }, 'Por favor, use um email válido')
  .refine((email) => {
    // Verificar se não contém caracteres perigosos
    const dangerousChars = /[<>'"&]/;
    return !dangerousChars.test(email);
  }, 'Email contém caracteres inválidos');

// Validação de nome melhorada com sanitização
export const nameSchema = z.string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
  .refine((name) => {
    // Remover espaços extras e verificar se não está vazio
    return name.trim().length >= 2;
  }, 'Nome não pode estar vazio');

// Validação de título melhorada
export const titleSchema = z.string()
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título muito longo')
  .refine((title) => title.trim().length > 0, 'Título não pode estar vazio')
  .refine((title) => {
    // Verificar se não contém apenas caracteres especiais
    return /[a-zA-ZÀ-ÿ0-9]/.test(title);
  }, 'Título deve conter pelo menos uma letra ou número');

// Validação de mensagem melhorada com verificação de conteúdo
export const messageSchema = z.string()
  .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
  .max(5000, 'Mensagem muito longa')
  .refine((message) => message.trim().length > 0, 'Mensagem não pode estar vazia')
  .refine((message) => {
    // Verificar se não é apenas espaços ou caracteres especiais
    return /[a-zA-ZÀ-ÿ0-9]/.test(message);
  }, 'Mensagem deve conter texto válido');

// Validação de senha melhorada
export const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial')
  .refine((password) => {
    // Verificar se não contém sequências comuns
    const commonSequences = ['123456', 'abcdef', 'qwerty', 'password'];
    return !commonSequences.some(seq => password.toLowerCase().includes(seq));
  }, 'Senha não pode conter sequências comuns');

// Validação de data futura melhorada com timezone de Portugal
export const futureDateSchema = z.string()
  .min(1, 'Data de entrega é obrigatória')
  .refine((dateString) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, 'Data inválida')
  .refine((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Considerar timezone de Portugal (UTC+1/UTC+2)
    const portugalOffset = 1 * 60 * 60 * 1000; // 1 hora em ms
    const minFutureDate = new Date(now.getTime() + portugalOffset + (60 * 60 * 1000)); // 1 hora no futuro
    return date > minFutureDate;
  }, 'Data de entrega deve ser pelo menos 1 hora no futuro (horário de Portugal)')
  .refine((dateString) => {
    const date = new Date(dateString);
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 50); // Máximo 50 anos no futuro
    return date <= maxFutureDate;
  }, 'Data de entrega não pode ser mais de 50 anos no futuro');

// Schema para criação de keepsake melhorado com validação de criador
export const createKeepsakeSchema = z.object({
  title: titleSchema,
  message_content: messageSchema,
  delivery_date: futureDateSchema,
  recipient_name: nameSchema.optional(),
  recipient_email: emailSchema.optional(),
  recipient_phone: z.string()
    .regex(/^(\+351|351)?[0-9]{9}$/, 'Número de telefone inválido (formato português)')
    .optional(),
  type: z.enum(['digital', 'physical'], {
    errorMap: () => ({ message: 'Tipo deve ser digital ou físico' })
  }),
  // Validação para garantir que o criador está incluído
  creator: z.string().uuid('ID do criador é obrigatório'),
}).refine((data) => {
  // Se for digital, email é obrigatório
  if (data.type === 'digital' && !data.recipient_email) {
    return false;
  }
  // Se for físico, pelo menos um meio de contato é obrigatório
  if (data.type === 'physical' && !data.recipient_email && !data.recipient_phone) {
    return false;
  }
  return true;
}, {
  message: 'Email é obrigatório para keepsakes digitais. Para físicas, email ou telefone é obrigatório.',
  path: ['recipient_email']
}).refine((data) => {
  // Validar que a data de entrega é no futuro
  const deliveryDate = new Date(data.delivery_date);
  const now = new Date();
  return deliveryDate > now;
}, {
  message: 'Data de entrega deve ser no futuro',
  path: ['delivery_date']
});

// Schema de registro melhorado
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: nameSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema de login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória')
});

// Schema de contato melhorado
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .max(200, 'Assunto muito longo'),
  message: z.string()
    .min(20, 'Mensagem deve ter pelo menos 20 caracteres')
    .max(2000, 'Mensagem muito longa')
});

// Schema para compartilhamento público
export const publicShareSchema = z.object({
  keepsake_id: z.string().uuid('ID da keepsake inválido'),
  is_public: z.boolean(),
  share_token: z.string().min(32, 'Token de compartilhamento inválido').optional(),
  expires_at: z.string().datetime().optional()
}).refine((data) => {
  // Se for público, deve ter token e data de expiração
  if (data.is_public && (!data.share_token || !data.expires_at)) {
    return false;
  }
  return true;
}, {
  message: 'Token e data de expiração são obrigatórios para compartilhamento público',
  path: ['share_token']
});

// Validação de telefone português
export const phoneSchema = z.string()
  .regex(/^(\+351|351)?[0-9]{9}$/, 'Número de telefone inválido (formato português)')
  .optional();

// Schema para estatísticas (marketing)
export const statsSchema = z.object({
  total_keepsakes: z.number().min(0),
  total_users: z.number().min(0),
  total_deliveries: z.number().min(0),
  growth_rate: z.number().optional()
});

// Schema para programa de referência
export const referralSchema = z.object({
  referrer_id: z.string().uuid('ID do referenciador inválido'),
  referred_email: emailSchema,
  referral_code: z.string().min(6, 'Código de referência inválido'),
  bonus_keepsakes: z.number().min(0).max(10).default(3)
});
