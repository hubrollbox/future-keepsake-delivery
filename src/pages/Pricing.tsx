import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion, easeOut } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackSubscription, trackButtonClick } from '@/lib/analytics';
import cartaEscrita from "@/assets/carta-escrita.jpg";

const freemiumPlans = [
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
    keepsakeLimit: '1 por mês'
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
    popular: true,
    keepsakeLimit: '10 por mês'
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
    keepsakeLimit: '50 por mês'
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
    keepsakeLimit: '1 cápsula'
  }
];

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    trackButtonClick(`select_plan_${planId}`, 'pricing_page');
    
    if (!user) {
      toast.error('Faz login para continuar');
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      toast.success('Já estás no plano gratuito!');
      navigate('/dashboard');
      return;
    }

    const plan = freemiumPlans.find(p => p.id === planId);
    if (plan) {
      trackSubscription(plan.name, 'subscribe');
    }

    toast.info('A redirecionar para pagamento...', {
      description: 'Em breve serás redirecionado para o Stripe'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  return (
    <div className="min-h-screen bg-keepla-white">
      <Navigation />
      
      <main>
        {/* Hero Section com imagem de fundo */}
        <div className="relative py-20 px-4 md:px-0 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src={cartaEscrita} 
              alt="" 
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-keepla-white/80"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-8">
                <img src="/keepla-logo-red.svg" alt="keepla Logo" className="h-16" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-keepla-black mb-6 font-inter">
                Memórias que Ficam,
                <span className="block text-keepla-red font-georgia italic">
                  Entregues para Sempre
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 font-inter">
                Escolhe o plano perfeito para guardar e entregar as tuas memórias mais preciosas no momento exato.
              </p>

              {/* Billing Toggle - minimalista */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm font-medium font-inter ${
                  billingCycle === 'monthly' ? 'text-keepla-black' : 'text-gray-400'
                }`}>
                  Mensal
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingCycle === 'yearly' ? 'bg-keepla-red' : 'bg-keepla-gray'
                  }`}
                  aria-label="Alternar ciclo de cobrança mensal/anual"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-keepla-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium font-inter ${
                  billingCycle === 'yearly' ? 'text-keepla-black' : 'text-gray-400'
                }`}>
                  Anual
                </span>
                {billingCycle === 'yearly' && (
                  <span className="bg-keepla-red text-keepla-white text-xs px-3 py-1 rounded-full font-inter ml-2">
                    Poupa 17%
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 relative z-10 px-4"
          >
            {freemiumPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-keepla-red text-keepla-white text-sm px-4 py-1 rounded-full font-inter font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 border-2 ${
                  plan.popular 
                    ? 'border-keepla-red shadow-keepla hover:shadow-keepla' 
                    : 'border-keepla-gray hover:border-keepla-black'
                } bg-keepla-white`}>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-keepla-black font-inter mb-2">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-inter">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-keepla-black font-inter">
                          €{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-gray-500 ml-2 font-inter">
                            /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                        <p className="text-sm text-gray-500 mt-2 font-inter">
                          €{(plan.price.yearly / 12).toFixed(2)}/mês
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3 border-t border-keepla-gray pt-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-keepla-red mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-keepla-black font-inter">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Limitations */}
                    {plan.limitations && (
                      <div className="border-t border-keepla-gray pt-4">
                        <p className="text-xs text-gray-400 mb-2 font-inter">Limitações:</p>
                        <div className="space-y-1">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <p key={limitIndex} className="text-xs text-gray-400 font-inter">
                              • {limitation}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full mt-6 font-inter font-semibold ${
                        plan.popular
                          ? 'bg-keepla-red hover:bg-keepla-red-deep text-keepla-white'
                          : 'bg-keepla-black hover:bg-gray-800 text-keepla-white'
                      }`}
                      size="lg"
                    >
                      {plan.id === 'free' ? 'Começar Grátis' : 'Escolher Plano'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-20 text-center relative z-10 px-4"
          >
            <h2 className="text-3xl font-bold text-keepla-black mb-8 font-inter">
              Dúvidas Frequentes
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 text-left">
              <details className="bg-keepla-white p-6 rounded-lg border-2 border-keepla-gray hover:border-keepla-black transition-colors">
                <summary className="font-medium cursor-pointer text-keepla-black font-inter">
                  Posso cancelar a qualquer momento?
                </summary>
                <p className="text-gray-600 mt-3 font-inter">
                  Sim, podes cancelar a tua subscrição a qualquer momento sem taxas adicionais.
                </p>
              </details>
              <details className="bg-keepla-white p-6 rounded-lg border-2 border-keepla-gray hover:border-keepla-black transition-colors">
                <summary className="font-medium cursor-pointer text-keepla-black font-inter">
                  Como funciona o plano familiar?
                </summary>
                <p className="text-gray-600 mt-3 font-inter">
                  O plano familiar permite até 6 contas conectadas, com cápsulas colaborativas e controlo parental.
                </p>
              </details>
              <details className="bg-keepla-white p-6 rounded-lg border-2 border-keepla-gray hover:border-keepla-black transition-colors">
                <summary className="font-medium cursor-pointer text-keepla-black font-inter">
                  As sugestões de IA são seguras?
                </summary>
                <p className="text-gray-600 mt-3 font-inter">
                  Sim, utilizamos IA responsável e as tuas mensagens são processadas com total privacidade e segurança.
                </p>
              </details>
              <details className="bg-keepla-white p-6 rounded-lg border-2 border-keepla-gray hover:border-keepla-black transition-colors">
                <summary className="font-medium cursor-pointer text-keepla-black font-inter">
                  Posso fazer upgrade do meu plano?
                </summary>
                <p className="text-gray-600 mt-3 font-inter">
                  Sim, podes fazer upgrade a qualquer momento e pagar apenas a diferença proporcional.
                </p>
              </details>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Pricing;