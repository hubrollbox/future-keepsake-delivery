
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft, Star, BookOpen, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: "Poesia nas Memórias",
      description: "Cada mensagem é um verso guardado no tempo, esperando o momento perfeito para tocar o coração de quem a recebe."
    },
    {
      icon: BookOpen,
      title: "Afeto Atemporal",
      description: "O amor não conhece fronteiras temporais. Guardamos os gestos mais íntimos para que floresçam quando mais são precisos."
    },
    {
      icon: Star,
      title: "Contemplação do Futuro",
      description: "Cada entrega é uma ponte entre o presente e o futuro, criada com a sensibilidade de quem compreende o valor do tempo."
    }
  ];

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />

      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-steel-blue hover:text-earthy-burgundy transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/7e0c5190-80b1-4e6d-ac09-33e8e100f73f.png" 
              alt="Selo do Tempo - FuturoPresente"
              className="h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>
          
          <h1 className="text-hero text-steel-blue mb-6 leading-tight font-fraunces">
            Manifesto
            <span className="text-earthy-burgundy block">FuturoPresente</span>
          </h1>
          
          <p className="text-subtitle text-misty-gray mb-8 leading-relaxed">
            Nascemos de um gesto íntimo: uma mensagem escrita por um pai para a filha, 
            para ser lida aos 18 anos. Mais do que uma aplicação tecnológica, 
            somos um espaço de <span className="text-earthy-burgundy font-medium">memória, sensibilidade e presença.</span>
          </p>
        </div>

        {/* Missão */}
        <div className="emotion-card max-w-4xl mx-auto mb-16 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-earthy-burgundy" />
              </div>
            </div>
            <h2 className="text-section-title text-steel-blue mb-6 font-fraunces">
              A Nossa Missão
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-sand-beige/30 to-dusty-rose/10 rounded-2xl p-8 text-center">
            <p className="text-body-large text-misty-gray leading-relaxed italic font-fraunces mb-4">
              "Guardar emoções para o tempo certo. Porque há coisas que só fazem sentido 
              quando chegam no momento perfeito. E esse momento, só tu o conheces."
            </p>
            <p className="text-earthy-burgundy font-medium font-fraunces">
              — Presente no futuro
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-section-title text-steel-blue mb-8 text-center font-fraunces">
            A Nossa Essência
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="emotion-card border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-earthy-burgundy/20 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-earthy-burgundy" />
                  </div>
                  <h3 className="text-lg font-semibold text-steel-blue mb-3 font-fraunces group-hover:text-earthy-burgundy transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-misty-gray text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conceito Selo do Tempo */}
        <div className="mb-16">
          <div className="emotion-card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <img 
              src="/lovable-uploads/bf42c521-e251-4043-b3ff-6177090921b8.png" 
              alt="Conceito Selo do Tempo"
              className="h-20 w-auto object-contain mx-auto mb-6"
            />
            
            <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
              Conceito: Selo do Tempo
            </h2>
            
            <p className="text-misty-gray leading-relaxed mb-6">
              O conceito "Selo do Tempo" foi inspirado em carimbos postais e marcações temporais, 
              evocando a ideia de autenticidade e oficialidade de uma correspondência especial. 
              O selo circular com marcações de tempo simboliza a validação da mensagem para o futuro.
            </p>
            
            <div className="bg-gradient-to-r from-sand-beige/50 to-dusty-rose/20 rounded-xl p-6">
              <p className="text-steel-blue font-medium italic font-fraunces">
                "Cada entrega é uma promessa ao futuro, selada com o carinho do presente."
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center emotion-card p-8 md:p-12 max-w-3xl mx-auto">
          <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
            Quer Fazer Parte da Nossa História?
          </h2>
          <p className="text-misty-gray mb-6 leading-relaxed">
            Junta-te à nossa comunidade e ajuda-nos a continuar a criar 
            momentos mágicos para milhares de pessoas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="brand"
              onClick={() => navigate('/register')}
            >
              Começar Agora
            </Button>
            <Button 
              variant="brand-outline" 
              size="lg" 
              onClick={() => navigate('/contact')}
            >
              Falar Connosco
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
