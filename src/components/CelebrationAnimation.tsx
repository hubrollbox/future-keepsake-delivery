import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Gift, 
  Calendar,
  CheckCircle,
  Share2,
  Eye
} from 'lucide-react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  onClose: () => void;
  keepsakeTitle: string;
  deliveryDate: string;
  recipientCount: number;
  keepsakeId?: string;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isVisible,
  onClose,
  keepsakeTitle,
  deliveryDate,
  recipientCount,
  keepsakeId
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    if (isVisible) {
      // Sequência de animação
      const phases = [
        () => setAnimationPhase(1), // Fade in
        () => setShowConfetti(true), // Confetti
        () => setAnimationPhase(2), // Conteúdo principal
      ];

      phases.forEach((phase, index) => {
        setTimeout(phase, index * 500);
      });

      // Auto-close após 8 segundos
      const autoClose = setTimeout(() => {
        onClose();
      }, 8000);

      return () => clearTimeout(autoClose);
    }
  }, [isVisible, onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share && keepsakeId) {
      navigator.share({
        title: `Cápsula do Tempo: ${keepsakeTitle}`,
        text: `Criei uma cápsula do tempo especial que será entregue em ${formatDate(deliveryDate)}`,
        url: `${window.location.origin}/keepsake/${keepsakeId}`
      });
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(`${window.location.origin}/keepsake/${keepsakeId}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '💖', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Card Principal */}
      <Card className={`w-full max-w-2xl transition-all duration-1000 ${
        animationPhase >= 1 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-75 translate-y-10'
      }`}>
        
        {/* Header Gradient */}
        <div className="h-3 bg-gradient-to-r from-dusty-rose via-golden-honey to-earthy-burgundy" />
        
        <CardContent className="p-8 text-center">
          
          {/* Ícone Principal Animado */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-dusty-rose to-earthy-burgundy rounded-full flex items-center justify-center animate-pulse-gentle">
              <Gift className="w-12 h-12 text-white" />
            </div>
            
            {/* Elementos Orbitais */}
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-6 h-6 text-golden-honey" />
              <Heart className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-5 h-5 text-dusty-rose" />
              <Star className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-5 h-5 text-earthy-burgundy" />
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl font-serif text-steel-blue mb-4 animate-slide-up">
            🎉 Cápsula Criada com Sucesso!
          </h1>

          {/* Subtítulo */}
          <p className="text-xl text-misty-gray mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Sua mensagem especial está programada para tocar corações
          </p>

          {/* Detalhes da Cápsula */}
          <div className="bg-gradient-to-br from-lavender-mist to-warm-cream rounded-xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              {/* Título */}
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-soft">
                  <Sparkles className="w-6 h-6 text-dusty-rose" />
                </div>
                <h3 className="font-semibold text-steel-blue">Título</h3>
                <p className="text-sm text-misty-gray font-medium">"{keepsakeTitle}"</p>
              </div>

              {/* Data de Entrega */}
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-soft">
                  <Calendar className="w-6 h-6 text-earthy-burgundy" />
                </div>
                <h3 className="font-semibold text-steel-blue">Entrega</h3>
                <p className="text-sm text-misty-gray font-medium">{formatDate(deliveryDate)}</p>
              </div>

              {/* Destinatários */}
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-soft">
                  <Heart className="w-6 h-6 text-golden-honey" />
                </div>
                <h3 className="font-semibold text-steel-blue">Destinatários</h3>
                <p className="text-sm text-misty-gray font-medium">
                  {recipientCount} {recipientCount === 1 ? 'pessoa' : 'pessoas'}
                </p>
              </div>
            </div>
          </div>

          {/* Mensagem Motivacional */}
          <div className="bg-white border-2 border-dusty-rose/20 rounded-xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <p className="text-steel-blue leading-relaxed">
              <strong>Sua cápsula está segura!</strong> Ela será entregue automaticamente na data programada. 
              Você receberá uma confirmação quando a mensagem for enviada.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            
            <Button
              onClick={onClose}
              className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8 py-3"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Perfeito!
            </Button>

            {keepsakeId && (
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-dusty-rose text-dusty-rose hover:bg-dusty-rose hover:text-white px-8 py-3"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => window.location.href = '/dashboard'}
              className="text-misty-gray hover:text-steel-blue px-8 py-3"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver Dashboard
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Estilos CSS Customizados */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-confetti {
          animation: confetti linear infinite;
          font-size: 1.5rem;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CelebrationAnimation;