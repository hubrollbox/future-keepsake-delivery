/**
 * Funções utilitárias para validação de dados
 */

/**
 * Verifica se um código postal é válido no formato português (0000-000)
 * @param postalCode - O código postal a ser validado
 * @returns true se o código postal for válido, false caso contrário
 */
export function isValidPostalCode(postalCode: string): boolean {
  // Formato português: 0000-000
  const postalCodeRegex = /^\d{4}-\d{3}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Verifica se um número de telefone é válido
 * @param phone - O número de telefone a ser validado
 * @returns true se o número de telefone for válido, false caso contrário
 */
export function isValidPhone(phone: string): boolean {
  // Remove caracteres não numéricos para contagem
  const digits = phone.replace(/\D/g, '');
  // Verifica se tem pelo menos 9 dígitos e no máximo 15
  return digits.length >= 9 && digits.length <= 15;
}

/**
 * Verifica se uma data é futura
 * @param dateStr - A data a ser validada no formato string (YYYY-MM-DD)
 * @returns true se a data for futura, false caso contrário
 */
export function isFutureDate(dateStr: string): boolean {
  if (!dateStr) return false;
  
  const inputDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate > today;
}

/**
 * Retorna a data de amanhã no formato YYYY-MM-DD
 * @returns string com a data de amanhã
 */
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0] as string;
}

/**
 * Sanitiza uma string para prevenir XSS
 * @param input - A string a ser sanitizada
 * @returns A string sanitizada
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Verifica se um nome contém apenas caracteres válidos
 * @param name - O nome a ser validado
 * @returns true se o nome for válido, false caso contrário
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(name.trim());
}

/**
 * Verifica se um email é válido
 * @param email - O email a ser validado
 * @returns true se o email for válido, false caso contrário
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}