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
    description: "Perfeito para testes e exploração inicial",
    features: [
      "1 cápsula por mês",
      "Armazenamento: 10MB",
      "Duração: 1 ano",
      "Agendamento simples",
      "Texto/Imagem básico",
      "Sem notificações personalizadas"
    ],
    buttonText: "Começar Grátis",
    popular: false,
    color: "border-gray-200"
  },
  {
    id: "personal",
    name: "Pessoal",
    price: "4,99€",
    period: "/mês",
    description: "Para o utilizador individual que quer preservar memórias",
    features: [
      "10 cápsulas por mês",
      "50MB por cápsula",
      "Duração: 5 anos",
      "Texto/Imagem/Áudio",
      "Notificações por email",
      "Gamificação",
      "Edição pós-envio"
    ],
    buttonText: "Escolher Pessoal",
    popular: true,
    color: "border-amber-500",
    badge: "Mais Popular"
  },
  {
    id: "family",
    name: "Família",
    price: "9,99€",
    period: "/mês",
    description: "Ideal para famílias e grupos partilharem memórias",
    features: [
      "50 cápsulas por mês",
      "250MB por cápsula",
      "Duração: 10 anos",
      "Partilha familiar",
      "Multi-destinatários",
      "Todas funcionalidades do Pessoal",
      "Criação de álbuns"
    ],
    buttonText: "Escolher Família",
    popular: false,
    color: "border-amber-300",
    badge: "Premium"
  },
  {
    id: "events",
    name: "Eventos",
    price: "Desde 99€",
    period: "/pacote",
    description: "Para casamentos, empresas e eventos especiais",
    features: [
      "Ilimitado durante ativação",
      "Lote mínimo: 20 cápsulas",
      "2GB de armazenamento total",
      "6 meses após evento",
      "Página personalizada",
      "QR code de acesso",
      "Suporte premium",
      "Download pós-entrega"
    ],
    buttonText: "Contactar",
    popular: false,
    color: "border-keepla-red/30",
    badge: "Empresas"
  },
  {
    id: "individual",
    name: "Individual",
    price: "1,99€",
    period: "/cápsula",
    description: "Pagamento avulso para utilizador ocasional",
    features: [
      "1 cápsula única",
      "20MB de armazenamento",
      "Duração: 1 a 10 anos (escolha)",
      "Agendamento flexível",
      "Mensagem individual",
      "Notificação única"
    ],
    buttonText: "Comprar Cápsula",
    popular: false,
    color: "border-gray-200"
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
    id: "gift-simple",
    name: "Presente com Alma Simples",
    price: "12,99€",
    description: "Mensagem personalizada com texto, áudio, imagem e selo digital",
    category: "digital",
    popular: true
  },
  {
    id: "gift-eternal-moments",
    name: "Presente Momentos Eternos",
    price: "29,99€",
    description: "Pack multimédia com álbum digital/galeria com até 3 vídeos",
    category: "digital",
    popular: true
  },
  {
    id: "gift-premium",
    name: "Presente Com Alma Premium",
    price: "59,99€",
    description: "Pack completo com carta manuscrita digitalizada, vídeo e arte exclusiva",
    category: "digital"
  },
  {
    id: "gift-limited-edition",
    name: "Edição Limitada",
    price: "Sob consulta",
    description: "Colaborações com artistas para experiências exclusivas e surpresas",
    category: "digital"
  },
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
    category: "digital"
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