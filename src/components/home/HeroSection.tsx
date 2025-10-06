
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-memory.jpg";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image - P&B emotivo */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="" 
          className="w-full h-full object-cover grayscale opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-keepla-white/95 via-keepla-white/90 to-keepla-white/85"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Selo Keepla */}
          <div className="mb-8 mt-16">
            <div className="w-32 h-32 mx-auto mb-6">
              <img 
                src="/lovable-uploads/63935007-5aa4-4a0f-8ff5-f6bb5674cc7d.png" 
                alt="Keepla - Futuro Presente" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Main headline - Inter Bold */}
          <h1 className="text-5xl md:text-7xl font-bold text-keepla-black mb-6 leading-tight tracking-tight">
            Presente no
            <span className="block text-keepla-red italic">Futuro</span>
          </h1>

          {/* Subtitle - Inter Regular */}
          <p className="text-xl md:text-2xl text-keepla-black/70 mb-8 font-normal max-w-2xl mx-auto leading-relaxed">
            Cria cápsulas do tempo que guardam as tuas palavras, emoções e memórias para serem entregues no momento perfeito.
          </p>

          {/* Value proposition - Georgia Itálico (emotivo) */}
          <div className="mb-12 text-lg max-w-3xl mx-auto">
            <p className="italic text-keepla-black/60" style={{ fontFamily: 'Georgia, serif' }}>
              "Uma carta para o futuro é uma ponte entre quem somos hoje e quem seremos amanhã."
            </p>
          </div>

          {/* CTA Buttons - Identidade Keepla */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={handleStartJourney}
              size="lg" 
              className="text-lg px-8 py-6 bg-keepla-red hover:bg-keepla-red-deep text-keepla-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg font-semibold"
            >
              {user ? "Ir para Dashboard" : "Começar a minha jornada"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 border-keepla-black text-keepla-black hover:bg-keepla-black hover:text-keepla-white transition-all duration-300 rounded-lg font-semibold"
              onClick={() => navigate("/how-it-works")}
            >
              Como funciona
            </Button>
          </div>

          {/* Social proof - Minimalista */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-keepla-black/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-keepla-red rounded-full"></span>
              <span>Entregas seguras</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-keepla-red rounded-full"></span>
              <span>Memórias preservadas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-keepla-red rounded-full"></span>
              <span>Momentos eternizados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Keepla Red */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-keepla-red rounded-full flex justify-center">
          <div className="w-1 h-3 bg-keepla-red rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
