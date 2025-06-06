
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

const ManifestoSection = () => {
  const navigate = useNavigate();

  return (
    <div className="emotional-spacing">
      <div className="emotion-card p-8 md:p-12 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-earthy-burgundy" />
          </div>
        </div>
        
        <h2 className="text-section-title text-steel-blue mb-6 font-fraunces">
          Guardar Emoções para o Tempo Certo
        </h2>
        
        <p className="text-body-large text-misty-gray mb-8 leading-relaxed italic font-fraunces">
          "Porque há coisas que só fazem sentido quando chegam no momento perfeito. 
          E esse momento, só tu o conheces."
        </p>
        
        <p className="text-misty-gray mb-8 leading-relaxed">
          Nascemos de um gesto íntimo: uma mensagem escrita por um pai para a filha, 
          para ser lida aos 18 anos. Hoje, somos um espaço de <span className="text-earthy-burgundy font-medium">memória, sensibilidade e presença.</span>
        </p>

        <Button 
          variant="brand-outline" 
          size="lg"
          onClick={() => navigate('/about')}
          className="group"
        >
          Conhecer o Nosso Manifesto
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ManifestoSection;
