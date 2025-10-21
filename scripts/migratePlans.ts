import { supabase } from "../src/integrations/supabase/client";

const oldPlans = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Para testes e curiosos',
    price: { monthly: 0, yearly: 0 },
    features: [
      '1 cápsula por mês',
      '10MB de armazenamento',
      'Duração: 1 ano',
      'Agendamento simples',
      'Texto/Imagem básico'
    ],
    limitations: [
      'Sem notificações personalizadas',
      'Sem áudio/vídeo',
      'Sem gamificação'
    ],
    keepsakeLimit: '1 por mês',
    popular: false,
    active: true
  },
  {
    id: 'personal',
    name: 'Pessoal',
    description: 'Para o utilizador individual',
    price: { monthly: 4.99, yearly: 44.99 },
    features: [
      '10 cápsulas por mês',
      '50MB por cápsula',
      'Duração: 5 anos',
      'Texto/Imagem/Áudio',
      'Notificações por email',
      'Gamificação',
      'Edição pós-envio'
    ],
    limitations: [],
    keepsakeLimit: '10 por mês',
    popular: true,
    active: true
  },
  {
    id: 'family',
    name: 'Família',
    description: 'Para famílias e grupos',
    price: { monthly: 9.99, yearly: 99 },
    features: [
      '50 cápsulas por mês',
      '250MB por cápsula',
      'Duração: 10 anos',
      'Partilha familiar',
      'Multi-destinatários',
      'Todas funcionalidades do Pessoal',
      'Criação de álbuns'
    ],
    limitations: [],
    keepsakeLimit: '50 por mês',
    popular: false,
    active: true
  },
  {
    id: 'individual',
    name: 'Individual',
    description: 'Pagamento avulso',
    price: { monthly: 1.99, yearly: 1.99 },
    features: [
      '1 cápsula única',
      '20MB de armazenamento',
      'Duração: 1-10 anos (escolha)',
      'Agendamento flexível',
      'Mensagem individual',
      'Notificação única'
    ],
    limitations: [],
    keepsakeLimit: '1 cápsula',
    popular: false,
    active: true
  }
];

async function migratePlans() {
  for (const plan of oldPlans) {
    const { error } = await supabase
      .from('plans')
      .upsert(plan, { onConflict: 'id' });
    if (error) {
      console.error(`Erro ao migrar plano ${plan.name}:`, error);
    } else {
      console.log(`Plano ${plan.name} migrado com sucesso!`);
    }
  }
}

migratePlans();
