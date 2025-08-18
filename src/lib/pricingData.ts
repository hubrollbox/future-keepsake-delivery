// ===== TIPOS PÚBLICOS =====

export interface PublicPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
  color: string;
  badge?: string;
}

export interface PublicService {
  id: string;
  name: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  category?: 'storage' | 'digital' | 'physical' | 'capsule';
  popular?: boolean;
}

// ===== PLANOS PÚBLICOS (SEM DADOS SENSÍVEIS) =====

export const plans: PublicPlan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: "0€",
    period: "/mês",
    description: "Perfeito para começar a sua jornada no tempo",
    features: [
      "1 cápsula digital por mês",
      "Mensagens de texto simples",
      "Suporte por email",
      "Calendário básico"
    ],
    buttonText: "Começar Grátis",
    popular: false,
    color: "border-gray-200"
  },
  {
    id: "personal",
    name: "Pessoal",
    price: "5,99€",
    period: "/mês",
    description: "Para quem quer preservar memórias especiais com qualidade premium",
    features: [
      "5 cápsulas digitais por mês",
      "Upload de imagens e vídeos (até 100MB)",
      "Notificações prioritárias",
      "Histórico completo",
      "10% desconto em serviços físicos"
    ],
    buttonText: "Escolher Pessoal",
    popular: false,
    color: "border-amber-200",
    badge: "Valor"
  },
  {
    id: "timekeeper",
    name: "Guardião do Tempo",
    price: "10,99€",
    period: "/mês",
    description: "O plano premium para verdadeiros guardiões das memórias",
    features: [
      "Cápsulas digitais ilimitadas (~10 por mês)",
      "Sistema de selos e conquistas",
      "Árvore de memórias interativa",
      "Acesso ao mural de cápsulas públicas",
      "Acesso antecipado a funcionalidades",
      "Prioridade nas entregas",
      "15% desconto em serviços físicos"
    ],
    buttonText: "Tornar-me Guardião",
    popular: true,
    color: "border-amber-500",
    badge: "Mais Popular"
  },
  {
    id: "family",
    name: "Família",
    price: "19,99€",
    period: "/mês",
    description: "Conecte toda a família através do tempo com funcionalidades exclusivas",
    features: [
      "Até 4 membros da família",
      "Todas as funcionalidades do Guardião do Tempo",
      "Timeline familiar colaborativa",
      "Cápsulas partilhadas",
      "Gestão familiar centralizada",
      "20% desconto em eventos especiais",
      "20% desconto em serviços físicos"
    ],
    buttonText: "Escolher Família",
    popular: false,
    color: "border-amber-300",
    badge: "Premium"
  }
];

// ===== SERVIÇOS PÚBLICOS =====

export const storageServices: PublicService[] = [
  {
    id: "storage-1gb",
    name: "Armazenamento 1GB",
    price: "2,99€",
    yearlyPrice: "29,99€",
    description: "Para documentos e fotos básicas",
    category: "storage"
  },
  {
    id: "storage-5gb",
    name: "Armazenamento 5GB",
    price: "7,99€",
    yearlyPrice: "79,99€",
    description: "Para vídeos curtos e mais conteúdo",
    category: "storage",
    popular: true
  },
  {
    id: "storage-20gb",
    name: "Armazenamento 20GB",
    price: "19,99€",
    yearlyPrice: "199,99€",
    description: "Para utilizadores intensivos",
    category: "storage"
  }
];

export const digitalServices: PublicService[] = [
  {
    id: "digital-letter-simple",
    name: "Carta Digital Simples",
    price: "3,99€",
    description: "Carta digital básica com formatação elegante",
    category: "digital"
  },
  {
    id: "digital-letter-premium",
    name: "Carta Digital Premium",
    price: "7,99€",
    description: "Com verificação blockchain e formatação especial",
    category: "digital",
    popular: true
  },
  {
    id: "video-editing",
    name: "Edição de Vídeo",
    price: "14,99€",
    description: "Vídeo editado profissionalmente (até 2 minutos)",
    category: "digital"
  },
  {
    id: "photo-enhancement",
    name: "Melhoria de Fotos",
    price: "4,99€",
    description: "Restauração e melhoria automática de fotos antigas",
    category: "digital"
  }
];

export const physicalServices: PublicService[] = [
  {
    id: "scheduled-delivery",
    name: "Entrega Programada",
    price: "Desde 8,99€",
    description: "Entrega em Portugal Continental na data exacta",
    category: "physical",
    popular: true
  },
  {
    id: "package-reception",
    name: "Receção de Encomenda",
    price: "4,99€ - 7,99€",
    description: "Recebemos o teu presente no nosso armazém seguro",
    category: "physical"
  },
  {
    id: "purchase-service",
    name: "Serviço de Compra",
    price: "12% + 7,99€ mín.",
    description: "Compramos o produto por ti para entrega futura",
    category: "physical"
  }
];

export const timeCapsules: PublicService[] = [
  {
    id: "capsule-individual",
    name: "Cápsula Individual",
    price: "Desde 19,99€",
    description: "Caixa metálica personalizada para pequenos objectos",
    category: "capsule"
  },
  {
    id: "capsule-premium",
    name: "Cápsula Premium",
    price: "Desde 34,99€",
    description: "Com fechadura e maior capacidade",
    category: "capsule",
    popular: true
  },
  {
    id: "capsule-collective",
    name: "Cápsula Coletiva",
    price: "Desde 69,99€",
    description: "Pack básico para eventos, escolas, empresas",
    category: "capsule"
  },
  {
    id: "capsule-luxury",
    name: "Cápsula Luxo",
    price: "Desde 54,99€",
    description: "Com gravação personalizada e cerimónia de abertura",
    category: "capsule"
  }
];

// ===== FUNCIONALIDADES DE GAMIFICAÇÃO =====

export const gamificationFeatures = [
  {
    id: "time-stamps",
    name: "Selos Temporais",
    description: "Conquista selos únicos baseados na distância temporal das tuas entregas",
    icon: "🏆"
  },
  {
    id: "guardian-levels",
    name: "Níveis de Guardião",
    description: "Quanto mais distante a entrega, maior o prestígio desbloqueado",
    icon: "⭐"
  },
  {
    id: "memory-tree",
    name: "Árvore de Memórias",
    description: "Timeline visual com todas as tuas cápsulas e entregas programadas",
    icon: "🌳"
  },
  {
    id: "time-missions",
    name: "Missões Temporais",
    description: "Desafios especiais como 'Envia algo a ti próprio daqui a 5 anos'",
    icon: "🎯"
  }
];

// ===== FUNÇÕES UTILITÁRIAS PÚBLICAS =====

export function getPlanById(planId: string): PublicPlan | undefined {
  return plans.find(plan => plan.id === planId);
}

export function getServiceById(serviceId: string): PublicService | undefined {
  const allServices = [
    ...storageServices,
    ...digitalServices,
    ...physicalServices,
    ...timeCapsules
  ];
  return allServices.find(service => service.id === serviceId);
}

export function getServicesByCategory(category: string): PublicService[] {
  const allServices = [
    ...storageServices,
    ...digitalServices,
    ...physicalServices,
    ...timeCapsules
  ];
  return allServices.filter(service => service.category === category);
}

export function getPopularPlans(): PublicPlan[] {
  return plans.filter(plan => plan.popular);
}

export function getPopularServices(): PublicService[] {
  const allServices = [
    ...storageServices,
    ...digitalServices,
    ...physicalServices,
    ...timeCapsules
  ];
  return allServices.filter(service => service.popular);
}