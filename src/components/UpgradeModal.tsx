import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  Image, 
  Package, 
  Heart, 
  Gift, 
  Users, 
  Sparkles, 
  Crown,
  X,
  Check,
  Star
} from 'lucide-react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';

interface UpgradeOption {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: React.ComponentType<any>;
  features: string[];
  badge?: string;
  color: string;
  gradient: string;
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: string[];
  onUpgrade: (optionId: string) => void;
  isLoading?: boolean;
}

// Mapeamento de keywords para opções de upgrade
const UPGRADE_OPTIONS: Record<string, UpgradeOption[]> = {
  aniversario: [
    {
      id: 'video_birthday',
      title: 'Vídeo de Aniversário',
      description: 'Grave uma mensagem em vídeo especial para o aniversariante',
      price: 5.00,
      originalPrice: 8.00,
      icon: Video,
      features: [
        'Vídeo até 2 minutos',
        'Qualidade HD',
        'Edição automática',
        'Música de fundo'
      ],
      badge: 'Mais Popular',
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: 'photo_collage',
      title: 'Álbum de Fotos',
      description: 'Crie um álbum digital com suas melhores memórias',
      price: 3.00,
      icon: Image,
      features: [
        'Até 20 fotos',
        'Layout personalizado',
        'Filtros especiais',
        'Download em alta resolução'
      ],
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-purple-600'
    }
  ],
  amor: [
    {
      id: 'romantic_package',
      title: 'Pacote Romântico',
      description: 'Uma experiência completa para expressar seu amor',
      price: 7.00,
      originalPrice: 12.00,
      icon: Heart,
      features: [
        'Vídeo + Fotos + Áudio',
        'Template romântico',
        'Música personalizada',
        'Entrega em data especial'
      ],
      badge: 'Oferta Especial',
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-red-600'
    },
    {
      id: 'love_photo',
      title: 'Foto do Amor',
      description: 'Uma foto especial com moldura personalizada',
      price: 3.00,
      icon: Image,
      features: [
        'Moldura romântica',
        'Texto personalizado',
        'Filtro vintage',
        'Qualidade premium'
      ],
      color: 'text-keepla-red',
      gradient: 'from-rose-500 to-pink-600'
    }
  ],
  conquista: [
    {
      id: 'achievement_physical',
      title: 'Certificado Físico',
      description: 'Um certificado físico para celebrar sua conquista',
      price: 10.00,
      originalPrice: 15.00,
      icon: Package,
      features: [
        'Certificado impresso',
        'Papel premium',
        'Moldura incluída',
        'Entrega em casa'
      ],
      badge: 'Edição Limitada',
      color: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'trophy_digital',
      title: 'Troféu Digital',
      description: 'Um troféu digital animado para sua conquista',
      price: 4.00,
      icon: Crown,
      features: [
        'Animação 3D',
        'Som de vitória',
        'Compartilhamento social',
        'Certificado digital'
      ],
      color: 'text-amber-600',
      gradient: 'from-amber-500 to-yellow-600'
    }
  ],
  familia: [
    {
      id: 'family_album',
      title: 'Álbum da Família',
      description: 'Preserve as memórias familiares em um álbum especial',
      price: 6.00,
      icon: Users,
      features: [
        'Até 50 fotos',
        'Layout familiar',
        'Árvore genealógica',
        'Compartilhamento privado'
      ],
      badge: 'Família',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600'
    }
  ],
  amizade: [
    {
      id: 'friendship_gift',
      title: 'Presente da Amizade',
      description: 'Um presente digital especial para seu amigo',
      price: 4.00,
      icon: Gift,
      features: [
        'Card personalizado',
        'Mensagem de áudio',
        'Stickers exclusivos',
        'Lembrança permanente'
      ],
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-indigo-600'
    }
  ]
};

// Opções padrão quando não há keywords específicas
const DEFAULT_OPTIONS: UpgradeOption[] = [
  {
    id: 'premium_basic',
    title: 'Cápsula Premium',
    description: 'Desbloqueie recursos premium para sua cápsula',
    price: 4.99,
    icon: Sparkles,
    features: [
      'Vídeo ou áudio',
      'Múltiplas fotos',
      'Templates premium',
      'Suporte prioritário'
    ],
    badge: 'Recomendado',
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'ai_enhancement',
    title: 'IA Ilimitada',
    description: 'Acesso ilimitado às sugestões de IA',
    price: 2.99,
    icon: Sparkles,
    features: [
      'Sugestões ilimitadas',
      'Templates personalizados',
      'Correção automática',
      'Ideias criativas'
    ],
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600'
  }
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  keywords,
  onUpgrade,
  isLoading = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Determinar opções baseadas nas keywords
  const getRelevantOptions = (): UpgradeOption[] => {
    const relevantOptions: UpgradeOption[] = [];
    
    keywords.forEach(keyword => {
      if (UPGRADE_OPTIONS[keyword]) {
        relevantOptions.push(...UPGRADE_OPTIONS[keyword]);
      }
    });
    
    // Se não há opções específicas, usar as padrão
    if (relevantOptions.length === 0) {
      return DEFAULT_OPTIONS;
    }
    
    // Limitar a 3 opções e adicionar uma opção padrão
    const uniqueOptions = relevantOptions.slice(0, 2);
    if (DEFAULT_OPTIONS.length > 0 && DEFAULT_OPTIONS[0]) {
      uniqueOptions.push(DEFAULT_OPTIONS[0]);
    }
    
    return uniqueOptions;
  };

  const options = getRelevantOptions();

  const handleUpgrade = (optionId: string) => {
    setSelectedOption(optionId);
    setShowConfetti(true);
    
    // Mostrar confetti por 3 segundos
    setTimeout(() => setShowConfetti(false), 3000);
    
    toast.success('🎉 Upgrade selecionado! Redirecionando para pagamento...');
    
    setTimeout(() => {
      onUpgrade(optionId);
    }, 1500);
  };

  const getKeywordEmoji = (keywords: string[]): string => {
    if (keywords.includes('aniversario')) return '🎂';
    if (keywords.includes('amor')) return '💕';
    if (keywords.includes('conquista')) return '🏆';
    if (keywords.includes('familia')) return '👨‍👩‍👧‍👦';
    if (keywords.includes('amizade')) return '👫';
    return '✨';
  };

  const getPersonalizedTitle = (keywords: string[]): string => {
    if (keywords.includes('aniversario')) return 'Torne este aniversário inesquecível!';
    if (keywords.includes('amor')) return 'Expresse seu amor de forma única!';
    if (keywords.includes('conquista')) return 'Celebre sua conquista com estilo!';
    if (keywords.includes('familia')) return 'Preserve as memórias da família!';
    if (keywords.includes('amizade')) return 'Fortaleça os laços de amizade!';
    return 'Torne sua cápsula ainda mais especial!';
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-0 top-0 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <div className="text-4xl mb-2">{getKeywordEmoji(keywords)}</div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {getPersonalizedTitle(keywords)}
              </DialogTitle>
              <p className="text-gray-600">
                Detectamos que sua cápsula é sobre{' '}
                <span className="font-semibold text-purple-600">
                  {keywords.join(', ')}
                </span>
                . Aqui estão algumas opções especiais para você!
              </p>
            </motion.div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {options.map((option, index) => {
              const IconComponent = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                    }`}
                    onClick={() => !isLoading && handleUpgrade(option.id)}
                  >
                    {option.badge && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className={`bg-gradient-to-r ${option.gradient} text-white shadow-lg`}>
                          <Star className="w-3 h-3 mr-1" />
                          {option.badge}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-2">
                      <div className={`w-12 h-12 mx-auto mb-2 p-2 rounded-full bg-gradient-to-r ${option.gradient} text-white`}>
                        <IconComponent className="w-full h-full" />
                      </div>
                      <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center space-x-2">
                          {option.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              €{option.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className={`text-2xl font-bold ${option.color}`}>
                            €{option.price.toFixed(2)}
                          </span>
                        </div>
                        {option.originalPrice && (
                          <div className="text-xs text-green-600 font-medium">
                            Economize €{(option.originalPrice - option.price).toFixed(2)}!
                          </div>
                        )}
                      </div>
                      
                      <ul className="space-y-2 mb-4">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 transition-all duration-200`}
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(option.id);
                        }}
                      >
                        {isLoading && selectedOption === option.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Escolher Este
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center space-x-2 text-blue-700 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Por que fazer upgrade?</span>
            </div>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Torne sua cápsula mais impactante e memorável</li>
              <li>• Recursos exclusivos não disponíveis na versão gratuita</li>
              <li>• Suporte prioritário e entrega garantida</li>
              <li>• Satisfação garantida ou seu dinheiro de volta</li>
            </ul>
          </motion.div>
          
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Continuar com versão gratuita
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};