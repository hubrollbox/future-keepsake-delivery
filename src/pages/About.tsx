
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Star, BookOpen } from "lucide-react";
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

      <main className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-steel-blue hover:text-dusty-rose"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <SeloDoTempoIcon size={80} className="drop-shadow-sm" />
          </div>
          
          <h1 className="text-hero text-steel-blue mb-6 leading-tight font-fraunces">
            Manifesto
            <span className="text-dusty-rose block">FuturoPresente</span>
          </h1>
          
          <p className="text-subtitle text-misty-gray mb-8 leading-relaxed">
            Nascemos de um gesto íntimo: uma mensagem escrita por um pai para a filha, 
            para ser lida aos 18 anos. Mais do que uma aplicação tecnológica, 
            somos um espaço de <span className="text-dusty-rose font-medium">memória, sensibilidade e presença.</span>
          </p>
        </div>

        {/* Missão */}
        <div className="emotion-card max-w-3xl mx-auto mb-16 p-8">
          <h2 className="text-section-title text-steel-blue mb-6 text-center font-fraunces">
            A Nossa Missão
          </h2>
          <p className="text-body text-misty-gray text-center leading-relaxed italic font-fraunces">
            "Guardar emoções para o tempo certo. Porque há coisas que só fazem sentido 
            quando chegam no momento perfeito. E esse momento, só tu o conheces."
          </p>
          <p className="text-dusty-rose font-medium text-center mt-4 font-fraunces">
            — Presente no futuro
          </p>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-section-title text-steel-blue mb-8 text-center font-fraunces">
            A Nossa Essência
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="emotion-card text-center p-6 gentle-hover">
                <div className="w-16 h-16 bg-dusty-rose/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-dusty-rose" />
                </div>
                <h3 className="text-lg font-semibold text-steel-blue mb-3 font-fraunces">{value.title}</h3>
                <p className="text-misty-gray text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conceito Selo do Tempo */}
        <div className="mb-16">
          <div className="emotion-card p-8 max-w-4xl mx-auto text-center">
            <SeloDoTempoIcon size={60} className="mx-auto mb-6" />
            <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
              Conceito: Selo do Tempo
            </h2>
            <p className="text-misty-gray leading-relaxed mb-6">
              O conceito "Selo do Tempo" foi inspirado em carimbos postais e marcações temporais, 
              evocando a ideia de autenticidade e oficialidade de uma correspondência especial. 
              O selo circular com marcações de tempo simboliza a validação da mensagem para o futuro.
            </p>
            <div className="bg-sand-beige/50 rounded-xl p-6">
              <p className="text-steel-blue font-medium italic font-fraunces">
                "Cada entrega é uma promessa ao futuro, selada com o carinho do presente."
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center emotion-card p-8 max-w-3xl mx-auto">
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
