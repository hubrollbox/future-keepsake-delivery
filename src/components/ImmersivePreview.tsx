import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Calendar,
  Clock,
  User,
  Mail,
  Package,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

interface PreviewData {
  title: string;
  message: string;
  recipientName: string;
  deliveryDate: Date;
  emotion: string;
  type: 'digital' | 'physical';
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
}

interface ImmersivePreviewProps {
  data: PreviewData;
  onEdit?: () => void;
  onConfirm?: () => void;
}

const ImmersivePreview: React.FC<ImmersivePreviewProps> = ({ 
  data, 
  onEdit, 
  onConfirm 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [ambientMode, setAmbientMode] = useState(true);

  // Simular a experiência de recebimento
  const [simulationStep, setSimulationStep] = useState(0);
  const simulationSteps = [
    'Notificação recebida',
    'Abrindo a cápsula...',
    'Revelando o conteúdo',
    'Experiência completa'
  ];

  useEffect(() => {
    if (!showPreview || simulationStep >= simulationSteps.length - 1) return;
    
    if (showPreview && simulationStep < simulationSteps.length - 1) {
      const timer = setTimeout(() => {
        setSimulationStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPreview, simulationStep, simulationSteps.length]);

  const getEmotionTheme = (emotion: string) => {
    const themes = {
      love: {
        gradient: 'from-red-400 via-pink-400 to-red-600',
        accent: 'text-red-600',
        bg: 'bg-red-50',
        particles: '❤️'
      },
      gratitude: {
        gradient: 'from-yellow-400 via-orange-400 to-yellow-600',
        accent: 'text-yellow-600',
        bg: 'bg-yellow-50',
        particles: '🙏'
      },
      hope: {
        gradient: 'from-blue-400 via-cyan-400 to-blue-600',
        accent: 'text-blue-600',
        bg: 'bg-blue-50',
        particles: '⭐'
      },
      nostalgia: {
        gradient: 'from-purple-400 via-indigo-400 to-purple-600',
        accent: 'text-purple-600',
        bg: 'bg-purple-50',
        particles: '🌅'
      }
    };
    return themes[emotion as keyof typeof themes] || themes.love;
  };

  const theme = getEmotionTheme(data.emotion);

  const formatDeliveryDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays <= 7) return `Em ${diffDays} dias`;
    if (diffDays <= 30) return `Em ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays <= 365) return `Em ${Math.ceil(diffDays / 30)} meses`;
    return `Em ${Math.ceil(diffDays / 365)} anos`;
  };

  const NotificationPreview = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-dusty-rose to-steel-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-steel-blue mb-2">
            Você tem uma cápsula do tempo!
          </h3>
          <p className="text-misty-gray mb-4">
            "{data.title}" está pronta para ser aberta
          </p>
          <Button 
            onClick={() => setSimulationStep(1)}
            className="w-full bg-dusty-rose hover:bg-dusty-rose/90"
          >
            Abrir Cápsula
          </Button>
        </div>
      </div>
    </div>
  );

  const CapsuleOpening = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-steel-blue via-dusty-rose to-golden-honey flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-white rounded-full animate-spin mx-auto mb-8"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-serif mb-4">Abrindo sua cápsula...</h2>
        <p className="text-white/80">Preparando uma experiência especial</p>
      </div>
    </div>
  );

  const ContentReveal = () => (
    <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradient} flex items-center justify-center z-50 p-4`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4 animate-bounce">{theme.particles}</div>
          <h2 className="text-3xl font-serif text-steel-blue mb-2">{data.title}</h2>
          <p className="text-misty-gray">De você para {data.recipientName}</p>
        </div>
        
        <div className={`${theme.bg} rounded-2xl p-6 mb-6`}>
          <p className="text-steel-blue leading-relaxed text-lg">
            {data.message}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => setSimulationStep(3)}
            className="bg-dusty-rose hover:bg-dusty-rose/90"
          >
            Continuar Experiência
          </Button>
        </div>
      </div>
    </div>
  );

  const FullExperience = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Ambient Particles */}
        {ambientMode && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${Math.random() * 20 + 10}px`
                }}
              >
                {theme.particles}
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full mx-4 border border-white/20">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-6xl font-serif mb-4">{data.title}</h1>
            <p className="text-xl opacity-90">Para {data.recipientName}</p>
          </div>

          {/* Media Preview */}
          {data.mediaUrl && (
            <div className="bg-black/50 rounded-2xl p-4 mb-8">
              <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                  <p>Prévia do conteúdo multimídia</p>
                </div>
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <p className="text-white text-lg leading-relaxed">
              {data.message}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setAmbientMode(!ambientMode)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {ambientMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {ambientMode ? 'Modo Simples' : 'Modo Ambiente'}
            </Button>
            <Button
              onClick={() => setShowPreview(false)}
              className="bg-dusty-rose hover:bg-dusty-rose/90"
            >
              Fechar Preview
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(false)}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          ✕
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Preview Card */}
      <Card className="overflow-hidden shadow-xl border-0">
        <div className={`h-2 bg-gradient-to-r ${theme.gradient}`}></div>
        
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center`}>
                {data.type === 'digital' ? (
                  <Mail className="w-6 h-6 text-white" />
                ) : (
                  <Package className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-serif text-steel-blue">{data.title}</h2>
                <p className="text-misty-gray">Cápsula do tempo {data.type === 'digital' ? 'digital' : 'física'}</p>
              </div>
            </div>
            <Badge className={`${theme.bg} ${theme.accent} border-0`}>
              {data.emotion}
            </Badge>
          </div>

          {/* Content Preview */}
          <div className={`${theme.bg} rounded-xl p-6 mb-6`}>
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-4 h-4 text-misty-gray" />
              <span className="text-sm text-misty-gray">Para: {data.recipientName}</span>
            </div>
            <p className="text-steel-blue leading-relaxed mb-4">
              {data.message.length > 200 ? `${data.message.substring(0, 200)}...` : data.message}
            </p>
            {data.message.length > 200 && (
              <Button variant="ghost" size="sm" className={theme.accent}>
                Ler mensagem completa
              </Button>
            )}
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-dusty-rose" />
              <div>
                <div className="font-semibold text-steel-blue">Data de Entrega</div>
                <div className="text-sm text-misty-gray">
                  {data.deliveryDate.toLocaleDateString('pt-PT')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-dusty-rose" />
              <div>
                <div className="font-semibold text-steel-blue">Tempo Restante</div>
                <div className="text-sm text-misty-gray">
                  {formatDeliveryDate(data.deliveryDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Button */}
          <div className="text-center mb-6">
            <Button
              onClick={() => {
                setShowPreview(true);
                setSimulationStep(0);
              }}
              className="bg-gradient-to-r from-dusty-rose to-steel-blue text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Prévia da Experiência de Recebimento
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={onEdit}
              className="flex-1 sm:flex-none"
            >
              Editar Cápsula
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 sm:flex-none bg-dusty-rose hover:bg-dusty-rose/90"
            >
              Confirmar e Agendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Immersive Preview Overlay */}
      {showPreview && (
        <>
          {simulationStep === 0 && <NotificationPreview />}
          {simulationStep === 1 && <CapsuleOpening />}
          {simulationStep === 2 && <ContentReveal />}
          {simulationStep === 3 && <FullExperience />}
        </>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ImmersivePreview;

