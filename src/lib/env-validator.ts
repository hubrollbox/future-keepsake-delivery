/**
 * Validador de variáveis de ambiente
 * Este módulo verifica se todas as variáveis de ambiente necessárias estão definidas
 */

interface EnvVariable {
  name: string;
  required: boolean;
  description: string;
}

// Lista de variáveis de ambiente necessárias para a aplicação
const requiredEnvVars: EnvVariable[] = [
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'URL da API do Supabase'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Chave anônima do Supabase'
  },
  {
    name: 'VITE_STRIPE_PUBLIC_KEY',
    required: true,
    description: 'Chave pública do Stripe para processamento de pagamentos'
  },
  {
    name: 'VITE_SENTRY_DSN',
    required: false,
    description: 'DSN do Sentry para monitoramento de erros'
  },
  {
    name: 'VITE_GA_MEASUREMENT_ID',
    required: false,
    description: 'ID de medição do Google Analytics'
  },
  {
    name: 'VITE_RESEND_API_KEY',
    required: false,
    description: 'Chave da API Resend para envio de emails'
  }
];

/**
 * Verifica se todas as variáveis de ambiente necessárias estão definidas
 * @returns {boolean} true se todas as variáveis obrigatórias estão definidas, false caso contrário
 */
export function validateEnv(): boolean {
  const missingVars: string[] = [];
  
  requiredEnvVars.forEach(envVar => {
    const value = import.meta.env[envVar.name];
    if (envVar.required && (!value || value.trim() === '')) {
      missingVars.push(`${envVar.name} (${envVar.description})`);
    }
  });
  
  if (missingVars.length > 0) {
    console.error('Erro: As seguintes variáveis de ambiente obrigatórias não estão definidas:');
    missingVars.forEach(varName => console.error(`- ${varName}`));
    console.error('Por favor, verifique o arquivo .env ou as variáveis de ambiente do sistema.');
    return false;
  }
  
  return true;
}

/**
 * Verifica as variáveis de ambiente e lança um erro se alguma obrigatória estiver faltando
 * @throws {Error} Se alguma variável de ambiente obrigatória estiver faltando
 */
export function checkRequiredEnv(): void {
  const isValid = validateEnv();
  
  if (!isValid) {
    throw new Error('Variáveis de ambiente obrigatórias não definidas. Verifique o console para mais detalhes.');
  }
}

export default {
  validateEnv,
  checkRequiredEnv
};