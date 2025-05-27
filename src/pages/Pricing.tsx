
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, Star, Package, Mail, Heart, Users, Trophy, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  import { plans, storageServices, digitalServices, physicalServices, timeCapsules, gamificationFeatures } from "@/lib/pricingData";
import PlanCard from "@/components/PlanCard";
import ServiceCard from "@/components/ServiceCard";
import CapsuleCard from "@/components/CapsuleCard";
import GamificationCard from "@/components/GamificationCard";

  const storageServices = [
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

  const digitalServices = [
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

  const physicalServices = [
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

  const timeCapsules = [
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

  const gamificationFeatures = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-amber-700" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
              FuturoPresente
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Preços & Planos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            O teu tempo, entregue. Escolhe o plano perfeito para criares memórias futuras e viveres experiências emocionais únicas.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Planos de Assinatura</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
  <PlanCard key={index} plan={plan} />
))}
          </div>
        </div>

        {/* Gamification Section */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <Trophy className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Sistema de Gamificação</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Torna cada entrega numa aventura temporal. Conquista selos, desbloqueia níveis e cria a tua árvore de memórias.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamificationFeatures.map((feature, index) => (
  <GamificationCard key={index} feature={feature} iconIndex={index} />
))}
          </div>
        </div>

        {/* Storage Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Armazenamento Seguro</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guardamos os teus presentes físicos com total segurança até à data de entrega.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {storageServices.map((service, index) => (
  <ServiceCard key={index} service={service} highlightYearly={true} />
))}
          </div>
        </div>

        {/* Digital Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Entregas Digitais</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Envia mensagens, fotos e vídeos para o futuro com verificação blockchain e edição profissional.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {digitalServices.map((service, index) => (
  <ServiceCard key={index} service={service} />
))}
          </div>
        </div>

        {/* Physical Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Serviços Físicos</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recebemos, compramos e entregamos os teus presentes físicos na data exacta.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {physicalServices.map((service, index) => (
  <ServiceCard key={index} service={service} />
))}
          </div>
        </div>

        {/* Time Capsules */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Cápsulas do Tempo</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experiências únicas para indivíduos, casais, famílias, escolas e empresas. Cria memórias que duram para sempre.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeCapsules.map((capsule, index) => (
  <CapsuleCard key={index} capsule={capsule} />
))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center">
          <Users className="h-12 w-12 text-amber-700 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Começar a Tua Jornada Temporal?
          </h3>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Junta-te a milhares de guardiões do tempo que já estão a criar memórias para o futuro. 
            Começa com o plano gratuito e torna-te num verdadeiro Guardião do Tempo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              onClick={() => navigate('/register')}
            >
              Começar Grátis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-amber-600 text-amber-700 hover:bg-amber-50"
              onClick={() => navigate('/how-it-works')}
            >
              Saber Mais
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-6 w-6 text-amber-700" />
                <h4 className="font-bold text-amber-700">FuturoPresente</h4>
              </div>
              <p className="text-gray-600 text-sm">
                O teu tempo, entregue. Criando memórias para o futuro, uma entrega de cada vez.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Empresa</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-amber-700">Sobre</a></li>
                <li><a href="#" className="hover:text-amber-700">Contactos</a></li>
                <li><a href="#" className="hover:text-amber-700">Parcerias</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Serviços</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/pricing" className="hover:text-amber-700">Preços & Planos</a></li>
                <li><a href="#" className="hover:text-amber-700">Cápsulas do Tempo</a></li>
                <li><a href="/how-it-works" className="hover:text-amber-700">Como Funciona</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-amber-700">Termos e Condições</a></li>
                <li><a href="#" className="hover:text-amber-700">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 FuturoPresente™. O teu tempo, entregue.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
