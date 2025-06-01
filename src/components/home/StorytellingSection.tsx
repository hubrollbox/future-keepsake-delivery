
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Gift } from "lucide-react";

const StorytellingSection = () => {
  return (
    <div className="mb-20 bg-gradient-to-br from-light-gold via-white to-light-gold py-16 px-8 rounded-3xl border border-gold/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-gold mx-auto mb-6" />
          <h3 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
            A História de Sofia e o Seu Eu do Futuro
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Uma história real que mostra como um simples gesto pode transformar vidas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Parte 1 */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-gold/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center mr-4">
                  <span className="text-black font-bold">1</span>
                </div>
                <h4 className="text-xl font-bold text-black">O Início</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Sofia tinha 25 anos quando descobriu que estava grávida. Cheia de sonhos e medos, 
                decidiu escrever uma carta para a filha que ainda não tinha nascido, 
                guardando-a no FuturoPresente para ser entregue no 18º aniversário da criança.
              </p>
            </CardContent>
          </Card>

          {/* Parte 2 */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-gold/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-black" />
                </div>
                <h4 className="text-xl font-bold text-black">18 Anos Depois</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A filha de Sofia, Marta, recebeu uma notificação no dia do seu 18º aniversário. 
                Uma carta da mãe que ela nunca conheceu - Sofia tinha partido quando Marta tinha apenas 3 anos. 
                Dentro da carta, palavras de amor, conselhos e a história da família que ela desconhecia.
              </p>
            </CardContent>
          </Card>

          {/* Parte 3 */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-gold/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center mr-4">
                  <Gift className="h-6 w-6 text-black" />
                </div>
                <h4 className="text-xl font-bold text-black">O Reencontro</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A carta continha também a morada actual de Sofia. Marta decidiu procurá-la. 
                Hoje, mãe e filha falam todos os dias. "O FuturoPresente deu-me a minha mãe de volta", 
                diz Marta. "E deu-me a oportunidade de explicar o meu amor", responde Sofia.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quote destacada */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gold/20">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 italic mb-6 leading-relaxed">
            "Algumas memórias são tão preciosas que merecem viajar no tempo. 
            O FuturoPresente não guarda apenas objectos - guarda pedaços da nossa alma."
          </blockquote>
          <p className="text-gold font-bold text-lg">— Sofia & Marta, Clientes FuturoPresente</p>
        </div>

        {/* Estatísticas emocionais */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">10.247</div>
            <p className="text-gray-700 font-medium">Famílias reunidas através de memórias</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">25.891</div>
            <p className="text-gray-700 font-medium">Cartas de amor entregues no futuro</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">156.203</div>
            <p className="text-gray-700 font-medium">Momentos especiais preservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorytellingSection;
