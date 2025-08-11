import { z } from 'zod';
import { isValidPostalCode } from '@/utils/validation';

// Esquema de validação para o título
export const titleSchema = z.string()
  .min(5, 'O título deve ter pelo menos 5 caracteres')
  .max(100, 'O título não pode exceder 100 caracteres')
  .refine(title => title.trim().length > 0, 'O título não pode estar vazio')
  .transform(val => val.trim());

// Esquema de validação para a mensagem
export const messageSchema = z.string()
  .min(10, 'A mensagem deve ter pelo menos 10 caracteres')
  .max(2000, 'A mensagem não pode exceder 2000 caracteres')
  .refine(message => message.trim().length > 0, 'A mensagem não pode estar vazia')
  .transform(val => val.trim());

// Esquema de validação para a data de entrega
export const deliveryDateSchema = z.string()
  .refine(date => {
    if (!date) return false;
    const deliveryDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deliveryDate > today;
  }, { message: 'A data de entrega deve ser no futuro' });

// Esquema de validação para o nome do destinatário
export const recipientNameSchema = z.string()
  .min(2, 'O nome deve ter pelo menos 2 caracteres')
  .max(100, 'O nome não pode exceder 100 caracteres')
  .refine(name => name.trim().length > 0, 'O nome não pode estar vazio')
  .refine(name => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name.trim()), 'O nome contém caracteres inválidos')
  .transform(val => val.trim());

// Esquema de validação para o email
export const emailSchema = z.string()
  .email('Por favor, introduza um email válido')
  .min(1, 'Email é obrigatório')
  .max(255, 'Email demasiado longo')
  .transform(val => val.trim().toLowerCase());

// Esquema de validação para o telefone
export const phoneSchema = z.string()
  .min(9, 'O número de telefone deve ter pelo menos 9 dígitos')
  .refine(
    phone => /^\+?[0-9\s()-]{9,15}$/.test(phone.trim()),
    'O número de telefone é inválido'
  )
  .transform(val => val.trim());

// Esquema de validação para o código postal
export const postalCodeSchema = z.string()
  .min(1, 'O código postal é obrigatório')
  .refine(
    code => isValidPostalCode(code.trim()),
    'O código postal é inválido (formato: 0000-000)'
  )
  .transform(val => val.trim());

// Esquema de validação para a cidade
export const citySchema = z.string()
  .min(2, 'A cidade deve ter pelo menos 2 caracteres')
  .max(100, 'A cidade não pode exceder 100 caracteres')
  .refine(city => city.trim().length > 0, 'A cidade não pode estar vazia')
  .transform(val => val.trim());

// Esquema de validação para a rua
export const streetSchema = z.string()
  .min(5, 'A morada deve ter pelo menos 5 caracteres')
  .max(200, 'A morada não pode exceder 200 caracteres')
  .refine(street => street.trim().length > 0, 'A morada não pode estar vazia')
  .transform(val => val.trim());

// Esquema de validação para o estado/distrito
export const stateSchema = z.string()
  .max(100, 'O distrito não pode exceder 100 caracteres')
  .optional()
  .transform(val => val ? val.trim() : val);

// Esquema de validação para o país
export const countrySchema = z.string()
  .min(2, 'O país deve ter pelo menos 2 caracteres')
  .max(100, 'O país não pode exceder 100 caracteres')
  .default('Portugal')
  .transform(val => val.trim());

// Esquema de validação para o tipo de keepsake
export const keepsakeTypeSchema = z.enum(['digital', 'physical'], {
  errorMap: () => ({ message: 'Selecione um tipo válido de cápsula' }),
});

// Esquema de validação para o canal de entrega
export const deliveryChannelSchema = z.enum(['email', 'sms', 'physical'], {
  errorMap: () => ({ message: 'Selecione um canal de entrega válido' }),
});

// Esquema de validação para o formulário de keepsake completo
export const keepsakeFormSchema = z.object({
  title: titleSchema,
  message: messageSchema,
  delivery_date: deliveryDateSchema,
  type: keepsakeTypeSchema,
  recipient_name: recipientNameSchema,
  delivery_channel: deliveryChannelSchema,
  relationship: z.string().optional(),
  channel_cost: z.number().min(0),
  selected_products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().min(0),
      quantity: z.number().int().min(1)
    })
  ),
  total_cost: z.number().min(0),
  // Campos condicionais
  recipient_contact: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
})
.refine(data => {
  // Validação condicional para o canal de entrega
  if (data.delivery_channel === 'email') {
    return data.recipient_contact && emailSchema.safeParse(data.recipient_contact).success;
  }
  if (data.delivery_channel === 'sms') {
    return data.recipient_contact && phoneSchema.safeParse(data.recipient_contact).success;
  }
  return true;
}, {
  message: 'Contacto do destinatário inválido para o canal selecionado',
  path: ['recipient_contact']
})
.refine(data => {
  // Validação condicional para entrega física
  if (data.delivery_channel === 'physical') {
    return (
      data.street && streetSchema.safeParse(data.street).success &&
      data.city && citySchema.safeParse(data.city).success &&
      data.postal_code && postalCodeSchema.safeParse(data.postal_code).success
    );
  }
  return true;
}, {
  message: 'Endereço físico incompleto ou inválido',
  path: ['street']
});

// Tipo inferido do esquema para uso com TypeScript
export type KeepsakeFormValues = z.infer<typeof keepsakeFormSchema>;

// Esquema de validação para edição de keepsake
export const editKeepsakeSchema = z.object({
  title: titleSchema,
  content: messageSchema,
  delivery_date: deliveryDateSchema,
  recipient_email: emailSchema.nullable().optional(),
  recipient_phone: phoneSchema.nullable().optional(),
});

// Tipo inferido do esquema de edição para uso com TypeScript
export type EditKeepsakeFormValues = z.infer<typeof editKeepsakeSchema>;