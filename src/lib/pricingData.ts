// Dados de pricing extraídos de Pricing.tsx

export const plans = [
  {
    name: "Gratuito",
    price: "0€",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "1 entrega digital por mês",
      "Mensagens de texto simples",
      "Suporte por email",
      "Calendário básico"
    ],
    buttonText: "Começar Grátis",
    popular: false,
    color: "border-gray-200"
  },
  {
    name: "Pessoal",
    price: "3€",
    period: "/mês",
    description: "Para utilizadores regulares",
    features: [
      "5 entregas digitais por mês",
      "10% desconto em entregas físicas",
      "Upload de imagens e vídeos",
      "Notificações prioritárias",
      "Histórico completo"
    ],
    buttonText: "Escolher Pessoal",
    popular: false,
    color: "border-amber-200"
  },
  {
    name: "Guardião do Tempo",
    price: "5€",
    period: "/mês",
    description: "O mais popular",
    features: [
      "Entregas digitais ilimitadas",
      "Acesso antecipado a funcionalidades",
      "Sistema de selos e conquistas",
      "Prioridade nas entregas",
      "Árvore de memórias interativa",
      "Acesso ao mural de cápsulas públicas"
    ],
    buttonText: "Tornar-me Guardião",
    popular: true,
    color: "border-amber-500"
  },
  {
    name: "Família",
    price: "12€",
    period: "/mês",
    description: "Para toda a família",
    features: [
      "Até 4 membros da família",
      "Tudo do plano Guardião do Tempo",
      "Cápsulas partilhadas",
      "Gestão familiar centralizada",
      "Descontos em eventos especiais",
      "Timeline familiar colaborativa"
    ],
    buttonText: "Escolher Família",
    popular: false,
    color: "border-amber-300"
  }
];

export const storageServices = [
  {
    name: "Armazenamento Pequeno",
    price: "1,90€/mês",
    yearlyPrice: "19€/ano",
    description: "Até 1kg - perfeito para cartas, pequenos objectos"
  },
  {
    name: "Armazenamento Médio",
    price: "3,90€/mês",
    yearlyPrice: "39€/ano", 
    description: "Até 5kg - livros, roupas, presentes médios"
  },
  {
    name: "Primeiros 30 dias",
    price: "Grátis",
    yearlyPrice: "",
    description: "Armazenamento gratuito no primeiro mês"
  }
];

export const digitalServices = [
  {
    name: "Carta Digital Simples",
    price: "Grátis",
    description: "Mensagem de texto básica com data programada"
  },
  {
    name: "Carta Digital Premium",
    price: "2,50€",
    description: "Com verificação blockchain e formatação especial"
  },
  {
    name: "Edição de Vídeo",
    price: "9,90€",
    description: "Vídeo editado profissionalmente (até 1 minuto)"
  }
];

export const physicalServices = [
  {
    name: "Entrega Programada",
    price: "Desde 6,50€",
    description: "Entrega em Portugal Continental na data exacta"
  },
  {
    name: "Receção de Encomenda",
    price: "3€ - 5€",
    description: "Recebemos o teu presente no nosso armazém"
  },
  {
    name: "Serviço de Compra",
    price: "10% + 5€ mín.",
    description: "Compramos o produto por ti para entrega futura"
  }
];

export const timeCapsules = [
  {
    name: "Cápsula Individual",
    price: "Desde 15€",
    description: "Caixa metálica personalizada para pequenos objectos"
  },
  {
    name: "Cápsula Premium",
    price: "Desde 25€",
    description: "Com fechadura e maior capacidade"
  },
  {
    name: "Cápsula Coletiva",
    price: "Desde 49€",
    description: "Pack básico para eventos, escolas, empresas"
  },
  {
    name: "Cápsula Luxo",
    price: "Desde 40€",
    description: "Com gravação personalizada e cerimónia de abertura"
  }
];

export const gamificationFeatures = [
  {
    name: "Selos Temporais",
    description: "Conquista selos únicos baseados na distância temporal das tuas entregas"
  },
  {
    name: "Níveis de Guardião",
    description: "Quanto mais distante a entrega, maior o prestígio desbloqueado"
  },
  {
    name: "Árvore de Memórias",
    description: "Timeline visual com todas as tuas cápsulas e entregas programadas"
  },
  {
    name: "Missões Temporais",
    description: "Desafios especiais como 'Envia algo a ti próprio daqui a 5 anos'"
  }
];