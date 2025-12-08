import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShoppingCart } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackSubscription, trackButtonClick } from '@/lib/analytics';
import { useCart } from '@/contexts/CartContext';

function usePlans() {
  type Plan = {
    id: string;
    name: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    features: string[];
    limitations?: string[];
    keepsakeLimit?: string;
    popular?: boolean;
    active?: boolean;
  };
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    async function fetchPlans() {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("name");
      if (!error && data) setPlans(data as Plan[]);
    }
    fetchPlans();
  }, []);
  return plans;
}

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleSelectPlan = async (planId: string, planName: string, price: number) => {
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

    try {
      await addToCart(planId, planName, price);
      toast.success(`${planName} adicionado ao carrinho!`);
      trackSubscription(planName, 'subscribe');
      navigate('/checkout');
    } catch (error) {
      toast.error('Erro ao adicionar plano ao carrinho');
    }
  };
  const plans = usePlans();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-keepla-white">
      <SEOHead 
        title="Planos e Preços"
        description="Escolhe o plano perfeito para guardar e entregar as tuas memórias mais preciosas. Planos gratuitos e premium disponíveis."
        keywords="preços keepla, planos subscrição, cápsula tempo preços, memórias premium"
      />
      <Navigation />
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-keepla-black mb-4">Planos e Preços</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Escolhe o plano perfeito para guardar e entregar as tuas memórias mais preciosas no momento exato.</p>
        </div>
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium font-inter ${billingCycle === 'monthly' ? 'text-keepla-black' : 'text-gray-400'}`}>Mensal</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-keepla-red' : 'bg-keepla-gray'}`}
              aria-label="Alternar ciclo de cobrança mensal/anual"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-keepla-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium font-inter ${billingCycle === 'yearly' ? 'text-keepla-black' : 'text-gray-400'}`}>Anual</span>
            {billingCycle === 'yearly' && (
              <span className="bg-keepla-red text-keepla-white text-xs px-3 py-1 rounded-full font-inter ml-2">
                Poupa 17%
              </span>
            )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
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
                          €{Number(billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly) || 0}
                        </span>
                        {plan.price_monthly > 0 && (
                          <span className="text-gray-500 ml-2 font-inter">
                            /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && typeof plan.price_yearly === 'number' && plan.price_monthly > 0 && (
                        <p className="text-sm text-gray-500 mt-2 font-inter">
                          €{(plan.price_yearly / 12).toFixed(2)}/mês
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3 border-t border-keepla-gray pt-6">
                      {(plan.features ?? []).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-keepla-red mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-keepla-black font-inter">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {/* Limitations */}
                    {Array.isArray(plan.limitations) && plan.limitations.length > 0 && (
                      <div className="border-t border-keepla-gray pt-4">
                        <p className="text-xs text-gray-400 mb-2 font-inter">Limitações:</p>
                        <div className="space-y-1">
                          {(plan.limitations ?? []).map((limitation, limitIndex) => (
                            <p key={limitIndex} className="text-xs text-gray-400 font-inter">
                              • {limitation}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(
                        plan.id, 
                        plan.name, 
                        billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
                      )}
                      className={`w-full mt-6 font-inter font-semibold ${
                        plan.popular
                          ? 'bg-keepla-red hover:bg-keepla-red-deep text-keepla-white'
                          : 'bg-keepla-black hover:bg-gray-800 text-keepla-white'
                      }`}
                      size="lg"
                    >
                      {plan.id === 'free' ? 'Começar Grátis' : 'Adicionar ao Carrinho'}
                      <ShoppingCart className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Pricing;