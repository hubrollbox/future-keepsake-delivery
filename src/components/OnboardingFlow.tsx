import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Heart, 
  Star, 
  Calendar,
  Sparkles,
  Users,
  Gift,
  CheckCircle
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visual: string;
  icon: React.ReactNode;
  tips: string[];
  action?: {
    text: string;
    onClick: () => void;
  };
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao FuturoPresente',
      subtitle: 'Presentes que transcendem o tempo',
      description: 'Crie memórias especiais e programe-as para serem entregues no momento perfeito. Seja um aniversário, uma data especial ou simplesmente quando alguém precisar de um sorriso.',
      visual: '🎁',
      icon: <Gift className="w-6 h-6" />,
      tips: [
        'Crie cápsulas digitais com mensagens, fotos e vídeos',
        'Programe entregas para datas futuras específicas',
        'Surpreenda pessoas queridas no momento certo'
      ]
    },
    {
      id: 'create',
      title: 'Como Criar uma Cápsula',
      subtitle: 'Três passos simples',
      description: 'Criar uma cápsula do tempo é fácil e intuitivo. Siga estes passos para começar a espalhar alegria.',
      visual: '✨',
      icon: <Sparkles className="w-6 h-6" />,
      tips: [
        '1. Escreva sua mensagem especial',
        '2. Escolha a data de entrega',
        '3. Adicione os destinatários'
      ],
      action: {
        text: 'Criar Minha Primeira Cápsula',
        onClick: () => {
          // Navegar para criação de cápsula
          window.location.href = '/create-keepsake';
        }
      }
    },
    {
      id: 'recipients',
      title: 'Compartilhe com Quem Importa',
      subtitle: 'Conecte corações através do tempo',
      description: 'Adicione familiares, amigos ou até mesmo você mesmo no futuro. Cada pessoa receberá sua mensagem no momento exato que você escolher.',
      visual: '💌',
      icon: <Users className="w-6 h-6" />,
      tips: [
        'Adicione múltiplos destinatários',
        'Personalize mensagens para cada pessoa',
        'Programe entregas em datas diferentes'
      ]
    },
    {
      id: 'delivery',
      title: 'Entrega Automática',
      subtitle: 'Tecnologia a serviço da emoção',
      description: 'Nossas cápsulas são entregues automaticamente na data programada. Você pode relaxar sabendo que sua mensagem chegará no momento perfeito.',
      visual: '🚀',
      icon: <Calendar className="w-6 h-6" />,
      tips: [
        'Entrega automática via email',
        'Confirmação quando a mensagem for entregue',
        'Histórico completo de todas as suas cápsulas'
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  // Movido para antes de qualquer retorno condicional
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  const handleNextRef = useRef(handleNext);
  
  // Atualiza a referência quando handleNext muda
  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);
  
  // Auto-advance para demonstração (opcional)
  // Movido para antes de qualquer retorno condicional
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === 0) {
        handleNextRef.current();
      }
    }, 5000); // Auto-advance após 5 segundos na primeira tela

    return () => clearTimeout(timer);
  }, [currentStep]);
  
  // Verificação de dados após todos os hooks
  if (!currentStepData) return null;

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-300 ${
        isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}>
        
        {/* Header com Progress (neutral) */}
        <div className="h-2 bg-keepla-gray" />
        
        <CardContent className="p-0">
          {/* Progress Bar */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleStepClick(index)}
                    aria-label={`Ir para etapa ${index + 1}`}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentStep 
                        ? 'bg-keepla-red scale-125' 
                        : index < currentStep || completedSteps.has(index)
                        ? 'bg-keepla-red/60' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-keepla-gray-light">
                {currentStep + 1} de {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Conteúdo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            
            {/* Lado Visual */}
            <div className="bg-keepla-white p-8 flex flex-col items-center justify-center text-center">
              <div className="text-8xl mb-6 animate-bounce-gentle">
                {currentStepData.visual}
              </div>
              
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                {currentStepData.icon}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif text-keepla-gray-dark mb-2">
                {currentStepData.title}
              </h1>
              
              <p className="text-lg text-keepla-gray-light font-medium">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Lado do Conteúdo */}
            <div className="p-8 flex flex-col justify-center">
              <p className="text-lg text-keepla-gray-dark leading-relaxed mb-6">
                {currentStepData.description}
              </p>

              {/* Tips */}
              <div className="space-y-3 mb-8">
                {currentStepData.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-keepla-red mt-0.5 flex-shrink-0" />
                    <span className="text-keepla-gray-dark">{tip}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {currentStepData.action && (
                <Button
                  onClick={currentStepData.action.onClick}
                  className="mb-6 bg-keepla-red hover:bg-keepla-red/90 text-white"
                >
                  {currentStepData.action.text}
                </Button>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-keepla-gray hover:text-keepla-gray-dark"
                >
                  Pular Tutorial
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-keepla-red hover:bg-keepla-red/90 text-white"
                >
                  <span>{currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementos Flutuantes Decorativos */}
      <div className="absolute top-20 left-10 opacity-30 animate-float">
        <Clock className="w-8 h-8 text-keepla-gray-dark" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-30 animate-float animate-float-delay-1">
        <Heart className="w-6 h-6 text-keepla-gray-dark" />
      </div>
      <div className="absolute top-1/2 left-20 opacity-30 animate-float animate-float-delay-2">
        <Star className="w-5 h-5 text-keepla-red" />
      </div>
    </div>
  );
};

export default OnboardingFlow;