
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-mist via-sand-beige/30 to-dusty-rose/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-dusty-rose animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-steel-blue animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-golden-honey animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Selo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <img src="/lovable-uploads/63935007-5aa4-4a0f-8ff5-f6bb5674cc7d.png" alt="keepla Logo" className="w-24 h-24 mx-auto" />
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-serif text-steel-blue mb-6 leading-tight">
            Presente no
            <span className="block text-dusty-rose italic">Futuro</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-misty-gray mb-8 font-light max-w-2xl mx-auto leading-relaxed">
            Cria cápsulas do tempo que guardam as tuas palavras, emoções e memórias para serem entregues no momento perfeito.
          </p>

          {/* Value proposition */}
          <div className="mb-12 text-lg text-steel-blue/80 max-w-3xl mx-auto">
            <p className="italic font-serif">
              "Uma carta para o futuro é uma ponte entre quem somos hoje e quem seremos amanhã."
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={handleStartJourney}
              size="lg" 
              className="text-lg px-8 py-4 bg-brand-gradient text-white shadow-soft hover:shadow-lg transition-all duration-300 transform hover:scale-105 rounded-2xl font-semibold"
            >
              {user ? "Ir para Dashboard" : "Começar a minha jornada"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 border-dusty-rose text-dusty-rose hover:bg-dusty-rose hover:text-white transition-all duration-300 rounded-2xl font-semibold"
              onClick={() => navigate("/how-it-works")}
            >
              Como funciona
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-misty-gray">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-dusty-rose rounded-full"></span>
              <span>Entregas seguras</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-steel-blue rounded-full"></span>
              <span>Memórias preservadas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-golden-honey rounded-full"></span>
              <span>Momentos eternizados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-dusty-rose rounded-full flex justify-center">
          <div className="w-1 h-3 bg-dusty-rose rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
