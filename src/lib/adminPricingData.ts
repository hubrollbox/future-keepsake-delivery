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
    internalCost: 0.40,
    margin: -100,
    monthlyCapsulesLimit: 1,
    features: [
      '1 cápsula por mês',
      'Armazenamento: 10MB',
      'Duração: 1 ano',
      'Agendamento simples',
      'Texto/Imagem básico'
    ],
    restrictions: [
      'Sem notificações personalizadas',
      'Sem áudio/vídeo',
      'Sem gamificação'
    ],
    isPopular: false,
    color: 'border-gray-200',
    buttonText: 'Começar Grátis'
  },
  {
    id: 'personal',
    name: 'Pessoal',
    publicPrice: 4.99,
    internalCost: 1.00,
    margin: 80,
    monthlyCapsulesLimit: 10,
    features: [
      '10 cápsulas por mês',
      '50MB por cápsula',
      'Duração: 5 anos',
      'Texto/Imagem/Áudio',
      'Notificações por email',
      'Gamificação',
      'Edição pós-envio'
    ],
    restrictions: [
      'Sem partilha familiar',
      'Sem multi-destinatários'
    ],
    isPopular: true,
    color: 'border-amber-500',
    buttonText: 'Escolher Pessoal'
  },
  {
    id: 'family',
    name: 'Família',
    publicPrice: 9.99,
    internalCost: 2.20,
    margin: 78,
    monthlyCapsulesLimit: 50,
    features: [
      '50 cápsulas por mês',
      '250MB por cápsula',
      'Duração: 10 anos',
      'Partilha familiar',
      'Multi-destinatários',
      'Todas funcionalidades do Pessoal',
      'Criação de álbuns'
    ],
    restrictions: [
      'Uso justo: até 50 cápsulas/mês'
    ],
    isPopular: false,
    color: 'border-amber-300',
    buttonText: 'Escolher Família'
  },
  {
    id: 'events',
    name: 'Eventos',
    publicPrice: 99,
    internalCost: 25.00,
    margin: 75,
    monthlyCapsulesLimit: 999,
    features: [
      'Ilimitado durante ativação',
      'Lote mínimo: 20 cápsulas',
      '2GB total',
      '6 meses após evento',
      'Página personalizada',
      'QR code',
      'Suporte premium',
      'Download pós-entrega'
    ],
    restrictions: [
      'Mínimo 20 cápsulas',
      'Pagamento único'
    ],
    isPopular: false,
    color: 'border-purple-300',
    buttonText: 'Contactar'
  },
  {
    id: 'individual',
    name: 'Individual',
    publicPrice: 1.99,
    internalCost: 0.35,
    margin: 82,
    monthlyCapsulesLimit: 1,
    features: [
      '1 cápsula única',
      '20MB armazenamento',
      'Duração: 1-10 anos',
      'Agendamento',
      'Mensagem individual',
      'Notificação única'
    ],
    restrictions: [
      'Pagamento por cápsula',
      'Sem subscrição'
    ],
    isPopular: false,
    color: 'border-gray-200',
    buttonText: 'Comprar Cápsula'
  }
];

// ===== SERVIÇOS ADMINISTRATIVOS =====

export const adminServices: AdminService[] = [
  // PRESENTES COM ALMA
  {
    id: 'gift_simple',
    name: 'Presente com Alma Simples',
    category: 'digital',
    publicPrice: 12.99,
    internalCost: 2.50,
    margin: 81,
    unit: 'pagamento único',
    description: 'Texto, áudio, imagem, entrega agendada, selo digital simbólico',
    limitations: ['Para aniversários e datas especiais']
  },
  {
    id: 'gift_eternal_moments',
    name: 'Presente Momentos Eternos',
    category: 'digital',
    publicPrice: 29.99,
    internalCost: 6.00,
    margin: 80,
    unit: 'pagamento único',
    description: 'Pack multimédia: texto, fotos, vídeos (até 3), visual interativo',
    limitations: ['Casamentos e grandes recordações']
  },
  {
    id: 'gift_premium',
    name: 'Presente Com Alma Premium',
    category: 'digital',
    publicPrice: 59.99,
    internalCost: 15.00,
    margin: 75,
    unit: 'pagamento único',
    description: 'Tudo do "Momentos Eternos" + carta manuscrita, ilustração, carta áudio',
    limitations: ['Grande declaração, ofertas especiais']
  },
  {
    id: 'gift_limited_edition',
    name: 'Edição Limitada',
    category: 'digital',
    publicPrice: 0, // Sob consulta
    internalCost: 0,
    margin: 0,
    unit: 'sob consulta',
    description: 'Colaborações com artistas, skins/fundos, experiências surpresa',
    limitations: ['Campanhas sazonais/parcerias']
  },

  // ARMAZENAMENTO FÍSICO
  {
    id: 'storage_1kg',
    name: 'Armazenamento Físico 1kg',
    category: 'storage',
    publicPrice: 5.00,
    internalCost: 1.50,
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
    internalCost: 2.80,
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
    internalCost: 0.30,
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
    internalCost: 5.00,
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
    internalCost: 8.50,
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
    internalCost: 12.00,
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
    internalCost: 18.00,
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
    internalCost: 25.00,
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