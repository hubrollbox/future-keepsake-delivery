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
    
    const phases = [
      () => setAnimationPhase(1),
      () => setShowConfetti(true),
      () => setAnimationPhase(2),
    ];

    phases.forEach((phase, index) => {
      setTimeout(phase, index * 500);
    });

    const autoClose = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(autoClose);
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
      navigator.clipboard.writeText(`${window.location.origin}/keepsake/${keepsakeId}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      
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

      <Card className={`w-full max-w-2xl transition-all duration-1000 ${
        animationPhase >= 1 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-75 translate-y-10'
      }`}>
        
        <div className="h-3 bg-keepla-red" />
        
        <CardContent className="p-8 text-center">
          
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-keepla-red rounded-full flex items-center justify-center animate-pulse-gentle">
              <Gift className="w-12 h-12 text-white" />
            </div>
            
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-6 h-6 text-keepla-red" />
              <Heart className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-5 h-5 text-keepla-red" />
              <Star className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-5 h-5 text-keepla-red" />
            </div>
          </div>

          <h1 className="text-4xl font-georgia text-keepla-black mb-4 animate-slide-up">
            🎉 Cápsula Criada com Sucesso!
          </h1>

          <p className="text-xl text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Sua mensagem especial está programada para tocar corações
          </p>

          <div className="bg-keepla-gray rounded-xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-keepla-red" />
                </div>
                <h3 className="font-semibold text-keepla-black">Título</h3>
                <p className="text-sm text-gray-600 font-medium">"{keepsakeTitle}"</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-md">
                  <Calendar className="w-6 h-6 text-keepla-red" />
                </div>
                <h3 className="font-semibold text-keepla-black">Entrega</h3>
                <p className="text-sm text-gray-600 font-medium">{formatDate(deliveryDate)}</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-md">
                  <Heart className="w-6 h-6 text-keepla-red" />
                </div>
                <h3 className="font-semibold text-keepla-black">Destinatários</h3>
                <p className="text-sm text-gray-600 font-medium">
                  {recipientCount} {recipientCount === 1 ? 'pessoa' : 'pessoas'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-keepla-gray rounded-xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-keepla-black leading-relaxed">
              <strong>Sua cápsula está segura!</strong> Ela será entregue automaticamente na data programada. 
              Você receberá uma confirmação quando a mensagem for enviada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            
            <Button
              onClick={onClose}
              className="bg-keepla-red hover:bg-keepla-red/90 text-white px-8 py-3"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Perfeito!
            </Button>

            {keepsakeId && (
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-keepla-red text-keepla-red hover:bg-keepla-red/10 hover:text-keepla-red px-8 py-3"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => window.location.href = '/dashboard'}
              className="text-gray-600 hover:text-keepla-black px-8 py-3"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver Dashboard
            </Button>
          </div>

        </CardContent>
      </Card>

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
