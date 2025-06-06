
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Gift } from "lucide-react";

const ManifestoSection = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section className="emotional-spacing bg-white/40 backdrop-blur-sm rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="text-6xl">🕊️</div>
          </div>
          
          <h2 className="text-section-title text-steel-blue mb-8 font-fraunces">
            Manifesto da Marca – Futuro Presente
          </h2>

          <div className="space-y-6 text-misty-gray leading-relaxed">
            <p className="text-xl md:text-2xl font-semibold text-dusty-rose mb-8 font-fraunces">
              Acreditamos no poder de uma mensagem enviada no tempo certo.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center emotion-card p-6">
                <Clock className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
                <p className="font-medium text-steel-blue">
                  Vivemos num mundo acelerado, onde tudo é imediato — mas há coisas que não devem ser ditas agora.
                </p>
              </div>
              <div className="text-center emotion-card p-6">
                <Heart className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
                <p className="font-medium text-steel-blue">
                  Há palavras que precisam de amadurecer, de esperar pelo momento certo para florescer.
                </p>
              </div>
              <div className="text-center emotion-card p-6">
                <Gift className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
                <p className="font-medium text-steel-blue">
                  Foi assim que nasceu o Futuro Presente: da vontade de guardar uma verdade, uma memória ou uma emoção.
                </p>
              </div>
            </div>

            <div className="emotion-card p-8 shadow-soft">
              <p className="mb-6 text-steel-blue">
                <strong className="text-dusty-rose">Guardamos aquilo que é importante.</strong> Protegemos aquilo que é íntimo. 
                Acreditamos que a entrega certa pode mudar o dia — ou até a vida — de quem a recebe.
              </p>

              <p className="mb-6 text-steel-blue">
                <strong className="text-dusty-rose">Somos mensageiros do futuro.</strong> Cada cápsula é um gesto de confiança, 
                um laço que resiste ao tempo, um presente com destino marcado.
              </p>

              <p className="mb-6 text-steel-blue">
                <strong className="text-dusty-rose">Não vendemos apenas entregas:</strong> Oferecemos tempo. Emoção. Intenção. Amor.
              </p>

              <p className="mb-6 text-steel-blue">
                Se hoje tens algo a dizer, mas sabes que só amanhã será compreendido, nós ajudamos-te a esperar.
              </p>

              <p className="text-xl font-semibold text-dusty-rose font-fraunces">
                Porque o amor, quando guardado com cuidado, chega sempre na hora certa.
              </p>
            </div>

            <div className="text-center mt-12">
              <p className="text-2xl md:text-3xl font-bold text-steel-blue mb-2 font-fraunces">Futuro Presente</p>
              <p className="text-lg text-dusty-rose font-medium italic font-fraunces">
                O que sentes hoje, no tempo de quem amas.
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <Button 
                size="lg" 
                variant="brand"
                onClick={() => handleNavigation('/products')}
              >
                Descobre os Nossos Presentes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
