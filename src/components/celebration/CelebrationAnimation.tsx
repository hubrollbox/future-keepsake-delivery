import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Gift, 
  CheckCircle
} from 'lucide-react';

interface CelebrationAnimationProps {
  type: 'created' | 'delivered' | 'received';
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Mostrar animação
    setIsVisible(true);

    // Gerar partículas aleatórias
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    // Auto-close se habilitado
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, duration);
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [autoClose, duration, onClose]);

  const getCelebrationConfig = () => {
    switch (type) {
      case 'created':
        return {
          icon: Gift,
          color: 'from-green-400 to-blue-400',
          emoji: '🎁',
          defaultMessage: 'Sua cápsula do tempo foi criada com sucesso!'
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'from-blue-400 to-purple-400',
          emoji: '📬',
          defaultMessage: 'Sua mensagem foi entregue!'
        };
      case 'received':
        return {
          icon: Heart,
          color: 'from-pink-400 to-red-400',
          emoji: '💝',
          defaultMessage: 'Você recebeu uma mensagem especial!'
        };
      default:
        return {
          icon: Sparkles,
          color: 'from-yellow-400 to-orange-400',
          emoji: '✨',
          defaultMessage: 'Celebração!'
        };
    }
  };

  const config = getCelebrationConfig();
  const IconComponent = config.icon;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Partículas de Fundo */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s'
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 opacity-70" />
        </div>
      ))}

      {/* Card Principal */}
      <Card className={`w-full max-w-md mx-4 overflow-hidden transform transition-all duration-500 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'
      }`}>
        {/* Header com Gradiente */}
        <div className={`h-2 bg-gradient-to-r ${config.color}`} />
        
        <CardContent className="p-8 text-center">
          {/* Ícone Principal Animado */}
          <div className="relative mb-6">
            <div className="text-8xl animate-bounce-gentle mb-4">
              {config.emoji}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-dusty-rose opacity-20"></div>
              <div className="animate-pulse absolute inline-flex h-16 w-16 rounded-full bg-dusty-rose opacity-30"></div>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-serif font-bold text-steel-blue mb-4">
            {title}
          </h2>

          {/* Mensagem */}
          <p className="text-lg text-misty-gray mb-6 leading-relaxed">
            {message || config.defaultMessage}
          </p>

          {/* Ícones Decorativos */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <Star className="w-6 h-6 text-golden-honey animate-pulse" />
            <IconComponent className="w-8 h-8 text-dusty-rose animate-bounce" />
            <Heart className="w-6 h-6 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Botão de Ação */}
          {!autoClose && (
            <Button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 500);
              }}
              className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8 py-2"
            >
              Continuar
            </Button>
          )}

          {/* Indicador de Auto-close */}
          {autoClose && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={`bg-gradient-to-r ${config.color} h-1 rounded-full transition-all ease-linear`}
                  style={{ 
                    width: '100%',
                    animation: `shrink ${duration}ms linear`
                  }}
                />
              </div>
              <p className="text-xs text-misty-gray mt-2">
                Fechando automaticamente...
              </p>
            </div>
          )}
        </CardContent>

        {/* Efeitos de Confete */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 bg-gradient-to-r ${config.color} rounded-full opacity-60`} />
            </div>
          ))}
        </div>
      </Card>

      {/* Estilos Customizados */}
      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CelebrationAnimation;