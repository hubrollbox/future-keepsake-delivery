import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Users, Sparkles, Crown, ArrowRight } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const freemiumPlans = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Perfeito para começar sua jornada de memórias',
    price: { monthly: 0, yearly: 0 },
    features: [
      '3 cápsulas do tempo por mês',
      '3 sugestões de IA por dia',
      'Entrega por email',
      'Mensagens de até 500 caracteres',
      'Suporte por email'
    ],
    limitations: [
      'Sem anexos de mídia',
      'Sem personalização avançada',
      'Sem backup em nuvem'
    ],
    icon: <Sparkles className="h-6 w-6" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    aiQuota: 3,
    keepsakeLimit: '3 por mês'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para quem quer preservar memórias sem limites',
    price: { monthly: 19.90, yearly: 199.90 },
    features: [
      'Cápsulas ilimitadas',
      '50 sugestões de IA por dia',
      'Anexos de fotos e vídeos',
      'Mensagens ilimitadas',
      'Entrega por email, SMS e WhatsApp',
      'Personalização avançada',
      'Backup automático',
      'Suporte prioritário'
    ],
    popular: true,
    icon: <Zap className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    aiQuota: 50,
    keepsakeLimit: 'Ilimitadas'
  },
  {
    id: 'family',
    name: 'Família',
    description: 'Compartilhe memórias com toda a família',
    price: { monthly: 39.90, yearly: 399.90 },
    features: [
      'Tudo do Premium',
      '100 sugestões de IA por dia',
      'Até 6 contas familiares',
      'Cápsulas colaborativas',
      'Álbum familiar compartilhado',
      'Controle parental',
      'Relatórios de atividade',
      'Suporte dedicado 24/7'
    ],
    icon: <Crown className="h-6 w-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    aiQuota: 100,
    keepsakeLimit: 'Ilimitadas'
  }
];

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      toast.error('Faça login para continuar');
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      toast.success('Você já está no plano gratuito!');
      navigate('/dashboard');
      return;
    }

    // Aqui seria integrado com Stripe
    toast.info('Redirecionando para pagamento...', {
      description: 'Em breve você será redirecionado para o Stripe'
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
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <div className="py-20 px-4 md:px-0">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
                ✨ Planos com IA Integrada
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Preserve Memórias com
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Inteligência Artificial
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Escolha o plano perfeito para guardar e entregar suas memórias mais preciosas no momento exato. 
                Com sugestões inteligentes de IA para tornar suas mensagens ainda mais especiais.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm font-medium ${
                  billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Mensal
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${
                  billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Anual
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    Economize 17%
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
          >
            {freemiumPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:scale-105'
                }`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      plan.bgColor
                    }`}>
                      <div className={plan.color}>
                        {plan.icon}
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          R$ {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-gray-500 ml-1">
                            /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          R$ {(plan.price.yearly / 12).toFixed(2)}/mês
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Limitations */}
                    {plan.limitations && (
                      <div className="border-t pt-4">
                        <p className="text-xs text-gray-500 mb-2">Limitações:</p>
                        <div className="space-y-1">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <p key={limitIndex} className="text-xs text-gray-400">
                              • {limitation}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full mt-6 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : plan.id === 'free'
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-purple-600 hover:bg-purple-700'
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
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Dúvidas frequentes
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 text-left">
              <details className="bg-white p-4 rounded-lg shadow-sm">
                <summary className="font-medium cursor-pointer">Posso cancelar a qualquer momento?</summary>
                <p className="text-gray-600 mt-2">Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.</p>
              </details>
              <details className="bg-white p-4 rounded-lg shadow-sm">
                <summary className="font-medium cursor-pointer">Como funciona o plano familiar?</summary>
                <p className="text-gray-600 mt-2">O plano familiar permite até 6 contas conectadas, com cápsulas colaborativas e controle parental.</p>
              </details>
              <details className="bg-white p-4 rounded-lg shadow-sm">
                <summary className="font-medium cursor-pointer">As sugestões de IA são seguras?</summary>
                <p className="text-gray-600 mt-2">Sim, utilizamos IA responsável e suas mensagens são processadas com total privacidade e segurança.</p>
              </details>
              <details className="bg-white p-4 rounded-lg shadow-sm">
                <summary className="font-medium cursor-pointer">Posso fazer upgrade do meu plano?</summary>
                <p className="text-gray-600 mt-2">Sim, você pode fazer upgrade a qualquer momento e pagar apenas a diferença proporcional.</p>
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
