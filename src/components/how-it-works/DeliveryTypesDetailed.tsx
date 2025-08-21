
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Mail, Heart, Clock, Shield, Sparkles, Upload, Download, Package, Smartphone, Cloud, Lock } from "lucide-react";

const DeliveryTypesDetailed = () => {
  return (
    <div className="mb-12 md:mb-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-blue mb-8 md:mb-12 text-center font-fraunces">
        Três Formas de <span className="text-earthy-burgundy">Viajar no Tempo</span>
      </h2>
      <p className="text-lg md:text-xl text-misty-gray mb-8 md:mb-10 text-center max-w-4xl mx-auto leading-relaxed">
        Cada tipo de entrega é uma experiência única, adaptada às tuas necessidades e sonhos. Desde cápsulas digitais instantâneas até experiências físicas premium.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {/* Cápsulas Digitais */}
        <Card className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20 group">
          <CardContent className="pt-6 text-center">
            <div className="relative mb-6">
              <Cloud className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto group-hover:animate-bounce-gentle" />
              <Badge variant="default" className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                Digital
              </Badge>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-steel-blue font-fraunces">Cápsulas Digitais</h3>
            <p className="text-misty-gray mb-6 leading-relaxed">
              Cartas, vídeos, fotos e áudios protegidos com tecnologia blockchain. Entrega instantânea e segura.
            </p>
            
            {/* Fluxo Digital */}
            <div className="space-y-4 mb-6 text-left">
              <div className="flex items-start space-x-3">
                <Upload className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">1. Upload Seguro</p>
                  <p className="text-xs text-misty-gray">Carrega ficheiros até 100MB</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">2. Encriptação</p>
                  <p className="text-xs text-misty-gray">Proteção blockchain avançada</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">3. Entrega Digital</p>
                  <p className="text-xs text-misty-gray">Email, SMS ou app móvel</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Badge variant="outline" className="text-xs">Plano Gratuito: 1 cápsula</Badge>
              <Badge variant="outline" className="text-xs">Plano Pessoal: 5 cápsulas</Badge>
            </div>
            <p className="text-earthy-burgundy font-semibold">A partir de €0 (Gratuito)</p>
          </CardContent>
        </Card>

        {/* Presentes Físicos */}
        <Card className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20 group">
          <CardContent className="pt-6 text-center">
            <div className="relative mb-6">
              <Package className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto group-hover:animate-bounce-gentle" />
              <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">Físico</Badge>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-steel-blue font-fraunces">Presentes Físicos</h3>
            <p className="text-misty-gray mb-6 leading-relaxed">
              Guardamos objetos preciosos em instalações ultra-seguras com controlo climático e monitorização 24/7.
            </p>
            
            {/* Fluxo Físico */}
            <div className="space-y-4 mb-6 text-left">
              <div className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">1. Recolha Segura</p>
                  <p className="text-xs text-misty-gray">Serviço de recolha ao domicílio</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">2. Armazenamento</p>
                  <p className="text-xs text-misty-gray">Instalação climatizada e segura</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">3. Entrega Programada</p>
                  <p className="text-xs text-misty-gray">Na data escolhida por ti</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Badge variant="outline" className="text-xs">Guardião: Armazenamento premium</Badge>
              <Badge variant="outline" className="text-xs">Família: Múltiplos objetos</Badge>
            </div>
            <p className="text-earthy-burgundy font-semibold">A partir de €4,99/mês</p>
          </CardContent>
        </Card>

        {/* Cápsulas Híbridas */}
        <Card className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20 group">
          <CardContent className="pt-6 text-center">
            <div className="relative mb-6">
              <Heart className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto group-hover:animate-bounce-gentle" />
              <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs">Premium</Badge>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-steel-blue font-fraunces">Cápsulas Híbridas</h3>
            <p className="text-misty-gray mb-6 leading-relaxed">
              A experiência completa: combina elementos físicos e digitais numa jornada emocional única e personalizada.
            </p>
            
            {/* Fluxo Híbrido */}
            <div className="space-y-4 mb-6 text-left">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">1. Curadoria Personalizada</p>
                  <p className="text-xs text-misty-gray">Consultoria para experiência única</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">2. Elementos Físicos + Digitais</p>
                  <p className="text-xs text-misty-gray">Objetos + conteúdo multimédia</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Download className="h-5 w-5 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-steel-blue">3. Experiência Coordenada</p>
                  <p className="text-xs text-misty-gray">Entrega sincronizada e especial</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Badge variant="outline" className="text-xs">Guardião: Cápsulas premium</Badge>
              <Badge variant="outline" className="text-xs">Família: Experiências coletivas</Badge>
            </div>
            <p className="text-earthy-burgundy font-semibold">Experiências personalizadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTypesDetailed;
