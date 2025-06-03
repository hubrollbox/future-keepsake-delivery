
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
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="text-6xl">🕊️</div>
          </div>
          
          <h2 className="text-section-title-sm md:text-section-title text-black mb-8 font-bold">
            Manifesto da Marca – Futuro Presente
          </h2>

          <div className="space-y-6 text-body md:text-body-large text-gray-700 leading-relaxed">
            <p className="text-xl md:text-2xl font-semibold text-gold mb-8">
              Acreditamos no poder de uma mensagem enviada no tempo certo.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Clock className="h-12 w-12 text-gold mx-auto mb-4" />
                <p className="font-medium">
                  Vivemos num mundo acelerado, onde tudo é imediato — mas há coisas que não devem ser ditas agora.
                </p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
                <p className="font-medium">
                  Há palavras que precisam de amadurecer, de esperar pelo momento certo para florescer.
                </p>
              </div>
              <div className="text-center">
                <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
                <p className="font-medium">
                  Foi assim que nasceu o Futuro Presente: da vontade de guardar uma verdade, uma memória ou uma emoção.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gold/20">
              <p className="mb-6">
                <strong className="text-gold">Guardamos aquilo que é importante.</strong> Protegemos aquilo que é íntimo. 
                Acreditamos que a entrega certa pode mudar o dia — ou até a vida — de quem a recebe.
              </p>

              <p className="mb-6">
                <strong className="text-gold">Somos mensageiros do futuro.</strong> Cada cápsula é um gesto de confiança, 
                um laço que resiste ao tempo, um presente com destino marcado.
              </p>

              <p className="mb-6">
                <strong className="text-gold">Não vendemos apenas entregas:</strong> Oferecemos tempo. Emoção. Intenção. Amor.
              </p>

              <p className="mb-6">
                Se hoje tens algo a dizer, mas sabes que só amanhã será compreendido, nós ajudamos-te a esperar.
              </p>

              <p className="text-xl font-semibold text-gold">
                Porque o amor, quando guardado com cuidado, chega sempre na hora certa.
              </p>
            </div>

            <div className="text-center mt-12">
              <p className="text-2xl md:text-3xl font-bold text-black mb-2">Futuro Presente</p>
              <p className="text-lg text-gold font-medium italic">
                O que sentes hoje, no tempo de quem amas.
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <Button 
                size="lg" 
                className="bg-gold-gradient text-black hover:opacity-90 font-bold px-8 py-4 rounded-xl"
                onClick={() => handleNavigation('/products')}
              >
                Descobre os Nossos Produtos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
