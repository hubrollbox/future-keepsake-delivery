
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, Heart, Mail } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="emotional-spacing text-center max-w-5xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center shadow-lg">
            <Clock className="h-10 w-10 text-black" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <Heart className="h-4 w-4 text-gold" />
          </div>
        </div>
      </div>
      
      <h1 className="text-hero text-gentle-black mb-6 leading-tight font-serif">
        O que sentes hoje,
        <span className="text-gold block"> no tempo de quem amas.</span>
      </h1>
      
      <p className="text-subtitle text-emotional mb-10 max-w-3xl mx-auto leading-relaxed">
        Escreve uma mensagem para o teu futuro. Escolhe quando a queres receber e deixa que o tempo cuide do resto. 
        <span className="text-gold font-medium"> Cada palavra guardada é uma promessa ao amanhã.</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
        <Button 
          size="lg" 
          className="px-12 py-6 bg-gold-gradient text-black hover:opacity-90 hover:scale-105 transition-all duration-300 font-semibold rounded-2xl shadow-lg text-lg min-h-[60px]" 
          onClick={() => handleNavigation('/register')}
        >
          <Mail className="h-5 w-5 mr-2" />
          Escrever ao Futuro
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="px-12 py-6 border-2 border-gold text-gentle-black hover:bg-gold/5 hover:scale-105 transition-all duration-300 font-semibold rounded-2xl text-lg min-h-[60px]" 
          onClick={() => handleNavigation('/products')}
        >
          Descobrir Presentes
        </Button>
      </div>

      {/* Emotional highlight */}
      <div className="bg-warm-gradient rounded-3xl p-8 emotion-card max-w-2xl mx-auto">
        <p className="text-emotional italic leading-relaxed">
          "Porque há coisas que só fazem sentido quando chegam no momento certo. 
          E esse momento, só tu o conheces."
        </p>
        <p className="text-gold font-medium mt-3 text-sm font-serif">
          — Presente no futuro
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
