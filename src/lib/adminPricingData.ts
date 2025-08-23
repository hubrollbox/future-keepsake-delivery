/**
 * DADOS ADMINISTRATIVOS DE PRECIFICAÇÃO - USO INTERNO APENAS
 * 
 * Este arquivo contém informações sensíveis de custos, margens e limites.
 * NUNCA deve ser importado em componentes públicos ou expostos ao cliente.
 * Uso exclusivo: Dashboard administrativo e cálculos internos de checkout.
 */

// ===== TIPOS E INTERFACES =====

export interface AdminPlan {
  id: string;
  name: string;
  publicPrice: number; // Preço final mostrado ao cliente
  internalCost: number; // Custo operacional interno
  margin: number; // Margem de lucro em %
  monthlyCapsulesLimit: number; // Limite de cápsulas por mês
  features: string[];
  restrictions: string[];
  isPopular: boolean;
  color: string;
  buttonText: string;
}

export interface AdminService {
  id: string;
  name: string;
  category: 'storage' | 'digital' | 'physical' | 'capsule';
  publicPrice: number;
  internalCost: number;
  margin: number;
  unit: string; // '/mês', '/kg', 'por item', etc.
  description: string;
  limitations?: string[];
}

export interface PricingCalculation {
  basePrice: number;
  serviceCosts: number;
  totalCost: number;
  margin: number;
  finalPrice: number;
  profitMargin: number;
}

// ===== PLANOS ADMINISTRATIVOS =====

export const adminPlans: AdminPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    publicPrice: 0,
    internalCost: 0.50, // Custo de infraestrutura por usuário
    margin: -100, // Plano de aquisição (prejuízo controlado)
    monthlyCapsulesLimit: 1,
    features: [
      '1 cápsula digital por mês',
      'Mensagens de texto simples',
      'Suporte por email',
      'Calendário básico'
    ],
    restrictions: [
      'Sem upload de mídia',
      'Sem notificações prioritárias',
      'Sem histórico completo',
      'Sem gamificação'
    ],
    isPopular: false,
    color: 'border-gray-200',
    buttonText: 'Começar Grátis'
  },
  {
    id: 'personal',
    name: 'Pessoal',
    publicPrice: 5.99,
    internalCost: 1.20, // Infraestrutura + storage + processamento
    margin: 80, // Margem de 80%
    monthlyCapsulesLimit: 5,
    features: [
      '5 cápsulas digitais por mês',
      'Upload de imagens e vídeos (até 100MB)',
      'Notificações prioritárias',
      'Histórico completo',
      '10% desconto em serviços físicos'
    ],
    restrictions: [
      'Sem gamificação avançada',
      'Sem acesso antecipado',
      'Sem mural público'
    ],
    isPopular: false,
    color: 'border-amber-200',
    buttonText: 'Escolher Pessoal'
  },
  {
    id: 'timekeeper',
    name: 'Guardião do Tempo',
    publicPrice: 10.99,
    internalCost: 2.50, // Infraestrutura premium + features avançadas
    margin: 77, // Margem de 77%
    monthlyCapsulesLimit: 999, // Ilimitado (limite técnico alto)
    features: [
      'Cápsulas digitais ilimitadas (~10 por mês)',
      'Sistema de selos e conquistas',
      'Árvore de memórias interativa',
      'Acesso ao mural de cápsulas públicas',
      'Acesso antecipado a funcionalidades',
      'Prioridade nas entregas',
      '15% desconto em serviços físicos'
    ],
    restrictions: [
      'Uso justo: ~10 cápsulas/mês recomendado'
    ],
    isPopular: true,
    color: 'border-amber-500',
    buttonText: 'Tornar-me Guardião'
  },
  {
    id: 'family',
    name: 'Família',
    publicPrice: 19.99,
    internalCost: 4.80, // Infraestrutura para 4 usuários + features colaborativas
    margin: 76, // Margem de 76%
    monthlyCapsulesLimit: 999, // Ilimitado compartilhado
    features: [
      'Até 4 membros da família',
      'Todas as funcionalidades do Guardião do Tempo',
      'Timeline familiar colaborativa',
      'Cápsulas partilhadas',
      'Gestão familiar centralizada',
      '20% desconto em eventos especiais',
      '20% desconto em serviços físicos'
    ],
    restrictions: [
      'Máximo 4 membros ativos',
      'Uso justo: ~15 cápsulas/mês total'
    ],
    isPopular: false,
    color: 'border-amber-300',
    buttonText: 'Escolher Família'
  }
];

// ===== SERVIÇOS ADMINISTRATIVOS =====

export const adminServices: AdminService[] = [
  // ARMAZENAMENTO FÍSICO
  {
    id: 'storage_1kg',
    name: 'Armazenamento Físico 1kg',
    category: 'storage',
    publicPrice: 5.00,
    internalCost: 1.50, // Espaço + segurança + manuseamento
    margin: 70,
    unit: '/mês',
    description: 'Até 1kg - cartas, pequenos objetos',
    limitations: ['Primeira semana grátis', 'Máximo 30x20x10cm']
  },
  {
    id: 'storage_5kg',
    name: 'Armazenamento Físico 5kg',
    category: 'storage',
    publicPrice: 10.00,
    internalCost: 2.80, // Espaço maior + manuseamento
    margin: 72,
    unit: '/mês',
    description: 'Até 5kg - livros, roupas, presentes médios',
    limitations: ['Primeira semana grátis', 'Máximo 50x40x30cm']
  },

  // EXTRAS DIGITAIS
  {
    id: 'premium_letter',
    name: 'Carta Digital Premium',
    category: 'digital',
    publicPrice: 3.50,
    internalCost: 0.30, // Processamento + templates premium
    margin: 91,
    unit: 'por carta',
    description: 'Formatação especial, templates exclusivos, verificação blockchain',
    limitations: ['Máximo 2000 caracteres']
  },
  {
    id: 'video_editing',
    name: 'Edição de Vídeo Profissional',
    category: 'digital',
    publicPrice: 17.50,
    internalCost: 5.00, // Tempo de editor + software + processamento
    margin: 71,
    unit: 'por vídeo',
    description: 'Edição profissional até 2 minutos, transições, música',
    limitations: ['Máximo 2 minutos', 'Até 3 revisões']
  },

  // CÁPSULAS FÍSICAS
  {
    id: 'capsule_individual',
    name: 'Cápsula Física Individual',
    category: 'capsule',
    publicPrice: 27.50,
    internalCost: 8.50, // Material + produção + envio
    margin: 69,
    unit: 'por cápsula',
    description: 'Caixa metálica personalizada, gravação laser, 15x15x8cm',
    limitations: ['Entrega em 7-10 dias úteis']
  },
  {
    id: 'capsule_premium',
    name: 'Cápsula Física Premium',
    category: 'capsule',
    publicPrice: 37.50,
    internalCost: 12.00, // Material premium + fechadura + produção
    margin: 68,
    unit: 'por cápsula',
    description: 'Com fechadura, maior capacidade, gravação personalizada, 20x20x12cm',
    limitations: ['Entrega em 10-14 dias úteis']
  },
  {
    id: 'capsule_collective',
    name: 'Cápsula Física Coletiva',
    category: 'capsule',
    publicPrice: 55.00,
    internalCost: 18.00, // Material + produção em lote + coordenação
    margin: 67,
    unit: 'por cápsula',
    description: 'Para eventos, escolas, empresas - até 50 contribuições, 30x30x20cm',
    limitations: ['Mínimo 10 participantes', 'Entrega em 14-21 dias úteis']
  },
  {
    id: 'capsule_luxury',
    name: 'Cápsula Física Luxo',
    category: 'capsule',
    publicPrice: 72.50,
    internalCost: 25.00, // Material premium + cerimónia + produção artesanal
    margin: 66,
    unit: 'por cápsula',
    description: 'Artesanal, cerimónia de abertura, gravação artística, 25x25x15cm',
    limitations: ['Entrega em 21-30 dias úteis', 'Produção limitada']
  }
];

// ===== FUNÇÕES DE CÁLCULO =====

/**
 * Calcula o preço final com base no plano e serviços selecionados
 * @param planId ID do plano selecionado
 * @param serviceIds Array de IDs dos serviços adicionais
 * @param quantities Array de quantidades para cada serviço
 * @returns Objeto com detalhes do cálculo de preços
 */
export function calculatePricing(
  planId: string,
  serviceIds: string[] = [],
  quantities: number[] = []
): PricingCalculation {
  const plan = adminPlans.find(p => p.id === planId);
  if (!plan) {
    throw new Error(`Plano não encontrado: ${planId}`);
  }

  const basePrice = plan.publicPrice;
  const baseCost = plan.internalCost;
  let serviceCosts = 0;
  let serviceInternalCosts = 0;

  // Calcular custos dos serviços adicionais
  serviceIds.forEach((serviceId, index) => {
    const service = adminServices.find(s => s.id === serviceId);
    if (service) {
      const quantity = quantities[index] || 1;
      serviceCosts += service.publicPrice * quantity;
      serviceInternalCosts += service.internalCost * quantity;
    }
  });

  const totalCost = baseCost + serviceInternalCosts;
  const finalPrice = basePrice + serviceCosts;
  const profitMargin = ((finalPrice - totalCost) / finalPrice) * 100;

  return {
    basePrice,
    serviceCosts,
    totalCost,
    margin: profitMargin,
    finalPrice,
    profitMargin
  };
}

/**
 * Verifica se um usuário pode criar mais cápsulas no mês atual
 * @param planId ID do plano do usuário
 * @param currentMonthCapsules Número de cápsulas já criadas no mês
 * @returns true se pode criar mais cápsulas
 */
export function canCreateCapsule(planId: string, currentMonthCapsules: number): boolean {
  const plan = adminPlans.find(p => p.id === planId);
  if (!plan) return false;
  
  return currentMonthCapsules < plan.monthlyCapsulesLimit;
}

/**
 * Calcula desconto baseado no plano do usuário
 * @param planId ID do plano do usuário
 * @param serviceCategory Categoria do serviço
 * @returns Percentual de desconto (0-100)
 */
export function getPlanDiscount(planId: string, serviceCategory: string): number {
  switch (planId) {
    case 'personal':
      return serviceCategory === 'physical' ? 10 : 0;
    case 'timekeeper':
      return serviceCategory === 'physical' ? 15 : 0;
    case 'family':
      return serviceCategory === 'physical' ? 20 : 0;
    default:
      return 0;
  }
}

/**
 * Aplica desconto ao preço de um serviço
 * @param originalPrice Preço original
 * @param discountPercent Percentual de desconto
 * @returns Preço com desconto aplicado
 */
export function applyDiscount(originalPrice: number, discountPercent: number): number {
  return originalPrice * (1 - discountPercent / 100);
}

// ===== CONSTANTES DE NEGÓCIO =====

export const BUSINESS_CONSTANTS = {
  FREE_STORAGE_DAYS: 7, // Primeira semana de armazenamento grátis
  MAX_VIDEO_DURATION_MINUTES: 2, // Máximo para edição de vídeo
  MAX_LETTER_CHARACTERS: 2000, // Máximo para carta premium
  RECOMMENDED_MONTHLY_CAPSULES: {
    timekeeper: 10,
    family: 15
  },
  MINIMUM_MARGIN_PERCENT: 60, // Margem mínima aceitável
  MAXIMUM_DISCOUNT_PERCENT: 25 // Desconto máximo aplicável
};

/**
 * Valida se uma configuração de preços está dentro dos parâmetros de negócio
 * @param calculation Resultado do cálculo de preços
 * @returns true se a configuração é válida
 */
export function validatePricingConfiguration(calculation: PricingCalculation): boolean {
  return calculation.profitMargin >= BUSINESS_CONSTANTS.MINIMUM_MARGIN_PERCENT;
}