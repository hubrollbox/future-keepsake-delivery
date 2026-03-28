
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const ManifestoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-section-lg">
      <div className="bg-card border border-border rounded-2xl max-w-4xl mx-auto p-8 md:p-12 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 font-inter">
          Porque Há Coisas Que Só Fazem Sentido<br />
          <span className="text-primary">No Momento Certo</span>
        </h2>

        <div className="space-y-6 text-muted-foreground leading-relaxed mb-8 font-inter">
          <p className="text-xl font-medium text-foreground">
            Vivemos num mundo acelerado, onde tudo é imediato — mas há palavras que precisam de amadurecer, 
            de esperar pelo momento perfeito para florescer.
          </p>
          
          <p className="text-lg">
            <strong className="text-primary">Guardamos aquilo que é importante.</strong> Protegemos aquilo que é íntimo. 
            Acreditamos que a entrega certa pode mudar o dia — ou até a vida — de quem a recebe.
          </p>

          <p className="text-lg italic font-fraunces">
            "Porque o amor, quando guardado com cuidado, chega sempre na hora certa."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="brand"
            onClick={() => navigate('/about')}
          >
            Conhecer a Nossa História
          </Button>
          <Button 
            variant="brand-outline" 
            size="lg" 
            onClick={() => navigate('/register')}
          >
            Começar Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
