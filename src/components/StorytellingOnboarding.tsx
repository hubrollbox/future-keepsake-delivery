import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Heart, 
  Star, 
  Sparkles
} from 'lucide-react';

interface StoryStep {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  visual: string;
  emotion: string;
  interactive?: {
    question: string;
    options: string[];
  };
}

interface StorytellingOnboardingProps {
  onComplete: (userChoices: Record<string, string>) => void;
  onSkip?: () => void;
}

const StorytellingOnboarding: React.FC<StorytellingOnboardingProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);

  const storySteps: StoryStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo à Keepla',
      subtitle: 'Onde o tempo se torna um presente',
      story: 'Imagine poder enviar uma mensagem para o futuro... Uma carta que chegará exatamente quando mais precisar dela. Uma memória que será redescoberta no momento perfeito.',
      visual: '🌟',
      emotion: 'wonder',
      interactive: {
        question: 'O que mais te emociona na ideia de enviar algo para o futuro?',
        options: [
          'Surpreender alguém especial',
          'Preservar memórias importantes',
          'Criar momentos únicos',
          'Conectar-me com meu eu futuro'
        ]
      }
    },
    {
      id: 'time-magic',
      title: 'A Magia do Tempo',
      subtitle: 'Cada momento tem o seu tempo',
      story: 'Sarah escreveu uma carta para sua filha no dia em que nasceu. "Para quando completares 18 anos", dizia o envelope. Hoje, 18 anos depois, essa carta chegou às mãos de uma jovem que descobriu o amor incondicional da mãe através das palavras do passado.',
      visual: '💌',
      emotion: 'love',
      interactive: {
        question: 'Que tipo de momento especial gostarias de criar?',
        options: [
          'Aniversários e celebrações',
          'Marcos importantes da vida',
          'Momentos de apoio e encorajamento',
          'Surpresas românticas'
        ]
      }
    },
    {
      id: 'connection',
      title: 'Conexões que Transcendem',
      subtitle: 'Ligando corações através do tempo',
      story: 'Miguel gravou um vídeo para seu melhor amigo antes de se mudar para outro país. "Abrir apenas quando sentires saudades", escreveu. Dois anos depois, numa noite difícil, João recebeu essa mensagem e sentiu que Miguel estava ali, ao seu lado.',
      visual: '🤝',
      emotion: 'friendship',
      interactive: {
        question: 'Quem são as pessoas mais importantes na tua vida?',
        options: [
          'Família próxima',
          'Parceiro(a) romântico(a)',
          'Amigos de longa data',
          'Eu mesmo(a)'
        ]
      }
    },
    {
      id: 'legacy',
      title: 'O Teu Legado',
      subtitle: 'Palavras que ecoam pela eternidade',
      story: 'Ana criou uma cápsula do tempo para cada neto no dia em que nasceram. Dentro, colocou fotos, cartas e pequenos objetos que contam a história da família. "Para que nunca esqueçam de onde vieram e para onde podem ir", disse ela.',
      visual: '🏛️',
      emotion: 'legacy',
      interactive: {
        question: 'Que legado gostarias de deixar?',
        options: [
          'Sabedoria e conselhos de vida',
          'Histórias familiares e tradições',
          'Amor e apoio incondicional',
          'Inspiração para sonhar grande'
        ]
      }
    },
    {
      id: 'your-journey',
      title: 'A Tua Jornada Começa',
      subtitle: 'Pronto para criar magia?',
      story: 'Agora é a tua vez. Cada cápsula que criares será uma ponte entre o presente e o futuro, um fio invisível que conecta corações e preserva o que realmente importa. Que história queres contar?',
      visual: '🚀',
      emotion: 'excitement'
    }
  ];

  const handleNext = () => {
    if (currentStep < storySteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setShowInteractive(false);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete(userChoices);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setShowInteractive(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleChoice = (choice: string) => {
    setUserChoices(prev => ({
      ...prev,
      [storySteps[currentStep].id]: choice
    }));
    setShowInteractive(false);
    setTimeout(handleNext, 1000);
  };

  const currentStoryStep = storySteps[currentStep];
  const progress = ((currentStep + 1) / storySteps.length) * 100;

  const getEmotionTheme = (emotion: string) => {
    const themes = {
      wonder: 'from-purple-400 to-pink-400',
      love: 'from-red-400 to-pink-400',
      friendship: 'from-blue-400 to-cyan-400',
      legacy: 'from-yellow-400 to-orange-400',
      excitement: 'from-green-400 to-blue-400'
    };
    return themes[emotion as keyof typeof themes] || 'from-gray-400 to-gray-600';
  };

  useEffect(() => {
    if (currentStoryStep.interactive && !showInteractive) {
      const timer = setTimeout(() => {
        setShowInteractive(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentStoryStep.interactive, showInteractive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-mist via-sand-beige/30 to-dusty-rose/20 flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(/emotional-journey-bg.png)' }}
      />
      
      <div className="relative z-10 w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-steel-blue font-medium">
              Passo {currentStep + 1} de {storySteps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-misty-gray hover:text-steel-blue"
            >
              Pular introdução
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Story Card */}
        <Card className={`overflow-hidden shadow-2xl transition-all duration-500 ${
          isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          {/* Header with Gradient */}
          <div className={`h-2 bg-gradient-to-r ${getEmotionTheme(currentStoryStep.emotion)}`} />
          
          <CardContent className="p-0">
            {/* Visual Section */}
            <div className="text-center py-12 px-8 bg-gradient-to-br from-white to-gray-50">
              <div className="text-8xl mb-6 animate-pulse">
                {currentStoryStep.visual}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-steel-blue mb-4">
                {currentStoryStep.title}
              </h1>
              <p className="text-xl text-dusty-rose font-light">
                {currentStoryStep.subtitle}
              </p>
            </div>

            {/* Story Content */}
            <div className="px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-misty-gray leading-relaxed text-center font-light">
                  {currentStoryStep.story}
                </p>

                {/* Interactive Section */}
                {currentStoryStep.interactive && showInteractive && (
                  <div className="mt-12 p-8 bg-gradient-to-br from-lavender-mist/30 to-dusty-rose/20 rounded-2xl border border-dusty-rose/20">
                    <h3 className="text-xl font-semibold text-steel-blue mb-6 text-center">
                      {currentStoryStep.interactive.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentStoryStep.interactive.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleChoice(option)}
                          className="p-6 h-auto text-left justify-start hover:bg-dusty-rose hover:text-white hover:border-dusty-rose transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-dusty-rose/20 flex items-center justify-center">
                              <span className="text-dusty-rose font-semibold">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>
                            <span>{option}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-advance indicator */}
                {currentStoryStep.interactive && !showInteractive && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-misty-gray">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span className="text-sm">A história continua...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 pb-8">
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

                <div className="flex space-x-2">
                  {storySteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-dusty-rose w-8'
                          : index < currentStep
                          ? 'bg-dusty-rose/60'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={currentStoryStep.interactive && showInteractive}
                  className="flex items-center space-x-2 bg-dusty-rose hover:bg-dusty-rose/90"
                >
                  <span>
                    {currentStep === storySteps.length - 1 ? 'Começar' : 'Próximo'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30 animate-float">
          <Clock className="w-8 h-8 text-dusty-rose" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-30 animate-float" style={{ animationDelay: '1s' }}>
          <Heart className="w-6 h-6 text-steel-blue" />
        </div>
        <div className="absolute top-1/2 left-20 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
          <Star className="w-5 h-5 text-golden-honey" />
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StorytellingOnboarding;

