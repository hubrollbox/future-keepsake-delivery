
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
        O teu tempo,
        <span className="text-gold"> entregue no futuro.</span>
      </h2>
      
      <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
        A primeira plataforma portuguesa que te permite agendar entregas de presentes físicos 
        ou digitais para datas especiais no futuro. Cria memórias atemporais com armazenamento seguro e entrega garantida.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 bg-gold-gradient text-black hover:opacity-90 font-semibold" 
          onClick={() => navigate('/register')}
        >
          Criar a Minha Primeira Entrega
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8 py-6 border-gold text-black hover-gold font-semibold" 
          onClick={() => navigate('/how-it-works')}
        >
          Descobrir Como Funciona
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
