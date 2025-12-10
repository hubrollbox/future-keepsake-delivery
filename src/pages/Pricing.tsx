import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Mail, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { trackButtonClick } from "@/lib/analytics";
import { useCart } from "@/contexts/CartContext";

const plans = [
  {
    id: "primeira-memoria",
    name: "Primeira Memória",
    price: "Grátis",
    priceValue: 0,
    description: "Experimenta a magia de enviar uma mensagem para o futuro",
    features: [
      "1 mensagem de texto (500 caracteres)",
      "Entrega por email",
      "Até 1 ano no futuro",
      "Template básico"
    ],
    cta: "Começar Grátis",
    highlighted: false
  },
  {
    id: "memoria-eterna",
    name: "Memória Eterna",
    price: "9,90€",
    priceValue: 9.90,
    description: "Cápsula digital completa sem limites",
    features: [
      "Texto ilimitado",
      "Fotos e vídeos (50MB)",
      "Até 5 destinatários",
      "Até 10 anos no futuro",
      "Templates premium",
      "Certificado digital"
    ],
    cta: "Criar Cápsula",
    highlighted: true
  },
  {
    id: "legado-familiar",
    name: "Legado Familiar",
    price: "24,90€",
    priceValue: 24.90,
    description: "5 cápsulas premium para toda a família",
    features: [
      "5 Cápsulas Digitais Premium",
      "Todas as funcionalidades premium",
      "Cápsulas colaborativas",
      "Dashboard familiar",
      "Poupa 50%"
    ],
    cta: "Para a Família",
    highlighted: false
  }
];

const comingSoonProducts = [
  {
    name: "Carta Física",
    description: "Carta manuscrita impressa em papel premium, selada e entregue em casa",
    icon: Mail
  },
  {
    name: "Cápsula Física",
    description: "Cápsula do tempo física com os teus conteúdos digitais impressos e preservados",
    icon: Package
  }
];

const faqs = [
  {
    question: "Posso enviar mais do que uma mensagem grátis?",
    answer: "A primeira memória é gratuita para experimentares a plataforma. Para enviares mais mensagens, podes escolher o plano Memória Eterna ou Legado Familiar."
  },
  {
    question: "Como funciona a entrega?",
    answer: "Na data que escolheres, o destinatário recebe um email especial com acesso à tua mensagem. É simples, seguro e emocionante."
  },
  {
    question: "Posso cancelar ou editar a minha cápsula?",
    answer: "Sim, podes editar ou cancelar a tua cápsula a qualquer momento antes da data de entrega programada."
  },
  {
    question: "O pagamento é único ou recorrente?",
    answer: "Pagamento único! Sem subscrições, sem surpresas. Pagas uma vez e a tua memória fica guardada para sempre."
  },
  {
    question: "Os meus dados estão seguros?",
    answer: "Absolutamente. Utilizamos encriptação de ponta a ponta e servidores seguros na Europa. As tuas memórias são privadas e protegidas."
  }
];

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    trackButtonClick(`select_plan_${plan.id}`, "pricing_page");

    if (plan.priceValue === 0) {
      if (!user) {
        navigate("/register");
        return;
      }
      navigate("/create-keepsake");
      return;
    }

    if (!user) {
      toast.error("Faz login para continuar");
      navigate("/login");
      return;
    }

    try {
      await addToCart(plan.id, plan.name, plan.priceValue);
      toast.success(`${plan.name} adicionado ao carrinho!`);
      navigate("/checkout");
    } catch {
      toast.error("Erro ao adicionar ao carrinho");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Preços - Keepla"
        description="Escolhe a forma perfeita de enviar amor através do tempo. Sem subscrições, sem surpresas. Paga uma vez, guarda para sempre."
        keywords="preços keepla, cápsula tempo preços, mensagem futuro grátis, presente memória"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-inter leading-tight">
            Escolhe a forma perfeita de enviar{" "}
            <span className="text-primary">amor</span> através do tempo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-inter">
            Preços transparentes, memórias eternas. Sem subscrições, sem surpresas.
            <br className="hidden md:block" />
            Paga uma vez, guarda para sempre.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground text-sm px-4 py-1.5 rounded-full font-inter font-medium shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}
              <Card
                className={`h-full transition-all duration-300 ${
                  plan.highlighted
                    ? "border-2 border-primary shadow-xl scale-[1.02]"
                    : "border border-border hover:border-foreground/30 hover:shadow-lg"
                }`}
              >
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl font-bold text-foreground font-inter mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-primary font-inter">
                      {plan.price}
                    </span>
                    {plan.priceValue > 0 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        /único
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-inter mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground font-inter">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full font-inter font-semibold py-6 ${
                      plan.highlighted
                        ? "bg-primary hover:bg-secondary text-primary-foreground"
                        : "bg-foreground hover:bg-foreground/90 text-background"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground font-inter">
                Brevemente
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground font-inter">
              Presentes Físicos
            </h2>
            <p className="text-muted-foreground mt-2 font-inter">
              Em breve, poderás enviar memórias que se podem tocar
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {comingSoonProducts.map((product) => (
              <Card
                key={product.name}
                className="border border-dashed border-border/60 bg-muted/30 opacity-75"
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <product.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground font-inter mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-inter">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center font-inter">
            Dúvidas Frequentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-card p-5 rounded-lg border border-border hover:border-foreground/20 transition-colors"
              >
                <summary className="font-medium cursor-pointer text-foreground font-inter flex items-center justify-between">
                  {faq.question}
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 font-inter text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-foreground text-background rounded-2xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-inter">
            Pronto para criar a tua primeira memória?
          </h2>
          <p className="text-background/80 mb-8 font-inter text-lg">
            Começa grátis. Sem cartão de crédito. Sem compromisso.
          </p>
          <Button
            onClick={() => navigate(user ? "/create-keepsake" : "/register")}
            size="lg"
            className="bg-primary hover:bg-secondary text-primary-foreground font-inter font-semibold px-8 py-6 text-lg"
          >
            Começar Grátis Agora
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Pricing;
