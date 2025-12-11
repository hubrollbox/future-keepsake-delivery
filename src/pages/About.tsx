import { Button } from "@/components/ui/button";
import { Heart, Star, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";


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
    <div className="min-h-screen bg-white/90">
      <SEOHead 
        title="Sobre Nós"
        description="Conhece a Keepla: uma plataforma dedicada à preservação de memória, sensibilidade e presença. Descobre a nossa missão e valores."
        keywords="sobre keepla, missão keepla, valores, memórias, cápsula tempo portugal"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <img 
              src="/keepla-logo-red.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="drop-shadow-sm" 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-inter font-bold text-foreground mb-6 leading-tight">
            Somos a{" "}
            <span className="text-primary block font-georgia italic">keepla</span>
          </h1>
          
          <p className="hero-subtitle text-muted-foreground mb-8">
            Uma plataforma dedicada à preservação de{" "}
            <span className="text-primary font-semibold">memória, sensibilidade e presença.</span>
          </p>
        </div>

        {/* Missão */}
        <div className="emotion-card max-w-4xl mx-auto mb-16 p-12 bg-card border border-border rounded-2xl">
          <p className="section-tagline text-center">A nossa promessa</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-6 text-center">
            A Nossa Missão
          </h2>
          <blockquote className="testimonial-quote text-center mb-6">
            "Acreditamos que há momentos que merecem ser guardados com o cuidado de quem sabe 
            que o tempo é o nosso bem mais precioso."
          </blockquote>
          <p className="slogan text-center">
            — Equipa keepla
          </p>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <p className="section-tagline text-center">O que nos move</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-8 text-center">
            A Nossa Essência
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl text-center p-8 hover:shadow-keepla hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-inter font-semibold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-georgia italic">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conceito Selo do Tempo */}
        <div className="mb-16">
          <div className="bg-card border border-border rounded-2xl p-12 max-w-5xl mx-auto text-center">
            <img 
              src="/keepla-logo-red.png" 
              alt="Logo" 
              style={{width: 80, height: 80, margin: '0 auto 2rem auto'}} 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
            />
            <p className="section-tagline">A nossa identidade</p>
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-6">
              Conceito: Selo do Tempo
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              O conceito "Selo do Tempo" foi inspirado em carimbos postais e marcações temporais, 
              evocando a ideia de autenticidade e oficialidade de uma correspondência especial. 
              O selo circular com marcações de tempo simboliza a validação da mensagem para o futuro.
            </p>
            <div className="bg-muted rounded-2xl p-8">
              <blockquote className="testimonial-quote">
                "Cada entrega é uma promessa ao futuro, selada com o carinho do presente."
              </blockquote>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-foreground text-background rounded-2xl p-12 max-w-4xl mx-auto">
          <p className="font-georgia italic text-background/70 mb-4">A tua história começa aqui</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold mb-6">
            Quer Fazer Parte da Nossa História?
          </h2>
          <p className="subtitle-emotional text-background/80 mb-8">
            Junta-te à nossa comunidade e ajuda-nos a continuar a criar 
            momentos mágicos para milhares de pessoas.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-secondary text-primary-foreground font-inter font-semibold px-8 py-6 shadow-keepla hover:shadow-keepla-intense transition-all group"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Começar Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/contact')}
              className="border-2 border-background text-background hover:bg-background/10 font-inter font-semibold px-8 py-6"
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
