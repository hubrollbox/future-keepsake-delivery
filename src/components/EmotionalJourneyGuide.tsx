import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Clock, Star, Sparkles, Calendar, Users } from 'lucide-react';

interface EmotionalContext {
  occasion: string;
  relationship: string;
  emotion: string;
  timeframe: string;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  suggestions: string[];
}

const EmotionalJourneyGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [context, setContext] = useState<EmotionalContext>({
    occasion: '',
    relationship: '',
    emotion: '',
    timeframe: ''
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const occasions = [
    { id: 'birthday', label: 'Aniversário', emoji: '🎂' },
    { id: 'wedding', label: 'Casamento', emoji: '💒' },
    { id: 'graduation', label: 'Formatura', emoji: '🎓' },
    { id: 'newborn', label: 'Nascimento', emoji: '👶' },
    { id: 'anniversary', label: 'Aniversário de Namoro', emoji: '💕' },
    { id: 'farewell', label: 'Despedida', emoji: '✈️' },
    { id: 'achievement', label: 'Conquista', emoji: '🏆' },
    { id: 'memory', label: 'Memória Especial', emoji: '📸' }
  ];

  const relationships = [
    { id: 'partner', label: 'Parceiro(a)', emoji: '💑' },
    { id: 'family', label: 'Família', emoji: '👨‍👩‍👧‍👦' },
    { id: 'friend', label: 'Amigo(a)', emoji: '👫' },
    { id: 'child', label: 'Filho(a)', emoji: '👶' },
    { id: 'parent', label: 'Pai/Mãe', emoji: '👨‍👩‍👧' },
    { id: 'colleague', label: 'Colega', emoji: '👔' },
    { id: 'mentor', label: 'Mentor', emoji: '🎓' },
    { id: 'self', label: 'Eu mesmo(a)', emoji: '🪞' }
  ];

  const emotions = [
    { id: 'love', label: 'Amor', emoji: '❤️' },
    { id: 'gratitude', label: 'Gratidão', emoji: '🙏' },
    { id: 'hope', label: 'Esperança', emoji: '🌟' },
    { id: 'pride', label: 'Orgulho', emoji: '🦁' },
    { id: 'nostalgia', label: 'Nostalgia', emoji: '🌅' },
    { id: 'encouragement', label: 'Encorajamento', emoji: '💪' },
    { id: 'celebration', label: 'Celebração', emoji: '🎉' },
    { id: 'wisdom', label: 'Sabedoria', emoji: '🦉' }
  ];

  const timeframes = [
    { id: 'days', label: 'Alguns dias', emoji: '📅' },
    { id: 'weeks', label: 'Algumas semanas', emoji: '📆' },
    { id: 'months', label: 'Alguns meses', emoji: '🗓️' },
    { id: 'year', label: 'Um ano', emoji: '🎊' },
    { id: 'years', label: 'Vários anos', emoji: '⏳' },
    { id: 'milestone', label: 'Marco específico', emoji: '🎯' }
  ];

  const journeySteps: JourneyStep[] = [
    {
      id: 'occasion',
      title: 'Qual é a ocasião?',
      description: 'Escolha o momento especial que quer celebrar ou marcar',
      icon: Calendar,
      suggestions: ['Pense no que torna este momento único', 'Considere o impacto emocional da ocasião']
    },
    {
      id: 'relationship',
      title: 'Para quem é esta mensagem?',
      description: 'Selecione o tipo de relacionamento com o destinatário',
      icon: Users,
      suggestions: ['Reflita sobre a conexão especial que têm', 'Pense no que esta pessoa significa para si']
    },
    {
      id: 'emotion',
      title: 'Que emoção quer transmitir?',
      description: 'Escolha o sentimento principal da sua mensagem',
      icon: Heart,
      suggestions: ['Conecte-se com o que realmente sente', 'Pense no impacto emocional desejado']
    },
    {
      id: 'timeframe',
      title: 'Quando deve ser entregue?',
      description: 'Defina o momento perfeito para a entrega',
      icon: Clock,
      suggestions: ['Considere o timing emocional ideal', 'Pense no contexto futuro do destinatário']
    }
  ];

  const handleSelection = (field: keyof EmotionalContext, value: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setContext(prev => ({ ...prev, [field]: value }));
      if (currentStep < journeySteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const getPersonalizedSuggestions = () => {
    const { occasion, relationship, emotion, timeframe } = context;
    
    if (!occasion || !relationship || !emotion || !timeframe) return [];

    const suggestions = [
      `Uma mensagem ${emotion === 'love' ? 'carinhosa' : emotion === 'gratitude' ? 'de agradecimento' : 'especial'} para ${relationship === 'partner' ? 'seu(sua) parceiro(a)' : relationship === 'family' ? 'sua família' : 'essa pessoa especial'}`,
      `Compartilhe uma memória marcante relacionada ao ${occasion}`,
      `Inclua uma foto ou vídeo que capture a essência do momento`,
      `Escreva sobre como esta pessoa impactou sua vida`,
      `Adicione uma previsão ou desejo para o futuro`
    ];

    return suggestions;
  };

  const renderSelectionGrid = (items: { id: string; emoji: string; label: string; }[], field: keyof EmotionalContext) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <Button
          key={item.id}
          variant={context[field] === item.id ? "default" : "outline"}
          className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 ${
            context[field] === item.id ? 'bg-primary text-white' : 'hover:bg-muted'
          }`}
          onClick={() => handleSelection(field, item.id)}
        >
          <span className="text-2xl">{item.emoji}</span>
          <span className="text-sm font-medium text-center">{item.label}</span>
        </Button>
      ))}
    </div>
  );

  const currentStepData = journeySteps[currentStep];

  if (!currentStepData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {journeySteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < journeySteps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < journeySteps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground-light">
          Passo {currentStep + 1} de {journeySteps.length}
        </p>
      </div>

      {/* Current Step Content */}
      <Card className={`transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif text-muted-foreground-dark flex items-center justify-center gap-2">
            <currentStepData.icon className="w-6 h-6 text-primary" />
            {currentStepData.title}
          </CardTitle>
          <p className="text-muted-foreground-light">{currentStepData.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selection Grid */}
          {currentStep === 0 && renderSelectionGrid(occasions, 'occasion')}
          {currentStep === 1 && renderSelectionGrid(relationships, 'relationship')}
          {currentStep === 2 && renderSelectionGrid(emotions, 'emotion')}
          {currentStep === 3 && renderSelectionGrid(timeframes, 'timeframe')}

          {/* Suggestions */}
          <div className="bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold text-muted-foreground-dark mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Dicas para esta etapa:
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground-light">
              {currentStepData.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Personalized Suggestions (Final Step) */}
          {currentStep === journeySteps.length - 1 && context.timeframe && (
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Sugestões personalizadas para sua cápsula:
              </h4>
              <ul className="space-y-2 text-sm">
                {getPersonalizedSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            
            {currentStep === journeySteps.length - 1 && context.timeframe ? (
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  // Aqui seria a navegação para o formulário de criação com o contexto
                  console.log('Contexto emocional:', context);
                }}
              >
                Criar Minha Cápsula
              </Button>
            ) : (
              <Button
                variant="ghost"
                disabled={!context[currentStepData.id as keyof EmotionalContext]}
                className="text-muted-foreground-light"
              >
                {context[currentStepData.id as keyof EmotionalContext] ? 'Próximo passo automático' : 'Faça uma seleção'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalJourneyGuide;

