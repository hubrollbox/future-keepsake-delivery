import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Heart, Calendar, Mail, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAIQuota } from '../hooks/useAIQuota';
import { AIQuotaStatus } from './AIQuotaStatus';
import { supabase } from '../integrations/supabase/client';

// Schema de validação Zod
const freeKeepsakeSchema = z.object({
  title: z.string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .refine(val => val.trim().length > 0, 'O título não pode estar vazio'),
  message: z.string()
    .min(10, 'A mensagem deve ter pelo menos 10 caracteres')
    .max(500, 'A mensagem deve ter no máximo 500 caracteres')
    .refine(val => val.trim().length > 0, 'A mensagem não pode estar vazia'),
  deliveryDate: z.string()
    .refine(val => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    }, 'A data de entrega deve ser no futuro'),
  recipientEmail: z.string()
    .email('Por favor, insira um email válido')
    .min(1, 'O email é obrigatório')
});

type FreeKeepsakeFormData = z.infer<typeof freeKeepsakeSchema>;

interface FreeKeepsakeFormProps {
  onSubmit: (data: FreeKeepsakeFormData & { keywords: string[] }) => void;
  onUpgradeRequest?: (keywords: string[]) => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: 'Título', icon: Heart, description: 'Dê um nome especial à sua cápsula' },
  { id: 2, title: 'Mensagem', icon: Sparkles, description: 'Escreva sua mensagem do coração' },
  { id: 3, title: 'Entrega', icon: Calendar, description: 'Quando e para quem enviar' }
];

// Palavras-chave para detecção de upsell
const KEYWORD_PATTERNS = {
  aniversario: /\b(aniversário|aniversario|birthday|nascimento|idade|anos?)\b/gi,
  amor: /\b(amor|te amo|love|querido|querida|coração|paixão|romântico|romântica)\b/gi,
  conquista: /\b(conquista|vitória|sucesso|graduação|formatura|promoção|achievement)\b/gi,
  familia: /\b(família|family|pai|mãe|filho|filha|irmão|irmã|avô|avó)\b/gi,
  amizade: /\b(amigo|amiga|friendship|amizade|companheiro|companheira)\b/gi
};

const detectKeywords = (text: string): string[] => {
  const keywords: string[] = [];
  Object.entries(KEYWORD_PATTERNS).forEach(([keyword, pattern]) => {
    if (pattern.test(text)) {
      keywords.push(keyword);
    }
  });
  return keywords;
};

const getEmotionalMessage = (step: number, hasErrors: boolean): string => {
  const errorMessages = [
    '💝 Quase lá! Vamos ajustar alguns detalhes...',
    '✨ Sua mensagem está quase perfeita!',
    '💌 Falta pouco para sua cápsula ficar pronta!'
  ] as const;
  
  const successMessages = [
    '💝 Que título lindo! Vamos para o próximo passo...',
    '✨ Sua mensagem está tocante! Agora vamos programar a entrega...',
    '🎉 Perfeito! Sua cápsula do tempo está pronta para ser criada!'
  ] as const;
  
  const messages = hasErrors ? errorMessages : successMessages;
  const idx = Math.max(0, Math.min(messages.length - 1, step - 1));
  const selected = messages[idx];
  const fallback = hasErrors ? errorMessages[0] : successMessages[0];
  return (selected ?? fallback) as string;
};

export const FreeKeepsakeForm: React.FC<FreeKeepsakeFormProps> = ({
  onSubmit,
  onUpgradeRequest,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const { quota, incrementUsage, canUseAI } = useAIQuota();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue
  } = useForm<FreeKeepsakeFormData>({
    resolver: zodResolver(freeKeepsakeSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();
  const progress = (currentStep / STEPS.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['title'],
      2: ['message'],
      3: ['deliveryDate', 'recipientEmail']
    };

    const isStepValid = await trigger(fieldsToValidate[currentStep as keyof typeof fieldsToValidate] as any);
    
    if (isStepValid) {
      if (currentStep === 2) {
        // Detectar keywords na mensagem para upsell
        const keywords = detectKeywords(watchedFields.message || '');
        setDetectedKeywords(keywords);
      }
      
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        toast.success(getEmotionalMessage(currentStep, false));
      }
    } else {
      toast.error(getEmotionalMessage(currentStep, true));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getAISuggestion = async () => {
    if (!canUseAI) {
      toast.error('Limite de sugestões diárias atingido!', {
        description: 'Faça upgrade para mais sugestões de IA.'
      });
      return;
    }

    const currentMessage = watch('message');
    if (!currentMessage || currentMessage.length < 10) {
      toast.error('Escreva pelo menos 10 caracteres para obter uma sugestão!');
      return;
    }

    setIsGettingSuggestion(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await supabase.functions.invoke('huggingface-suggestion', {
        body: {
          message: currentMessage,
          keywords: detectedKeywords,
          userId: session.user?.id || ''
        }
      });

      if (response.error) {
        throw response.error;
      }

      const { suggestion, fallback, remainingQuota } = response.data;
      
      if (suggestion) {
        setAiSuggestion(suggestion);
        await incrementUsage();
        
        toast.success(fallback ? 
          'Sugestão gerada localmente!' : 
          'Sugestão de IA gerada! ✨', {
          description: `Restam ${remainingQuota} sugestões hoje.`
        });
      } else {
        throw new Error('Nenhuma sugestão recebida');
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast.error('Erro ao obter sugestão da IA', {
        description: 'Tente novamente em alguns instantes.'
      });
    } finally {
      setIsGettingSuggestion(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setValue('message', aiSuggestion);
      setAiSuggestion('');
      toast.success('Sugestão aplicada! 🎯');
    }
  };

  const onFormSubmit = (data: FreeKeepsakeFormData) => {
    const keywords = detectKeywords(`${data.title} ${data.message}`);
    onSubmit({ ...data, keywords });
    
    // Mostrar modal de upgrade se houver keywords relevantes
    if (keywords.length > 0 && onUpgradeRequest) {
      setTimeout(() => onUpgradeRequest(keywords), 1000);
    }
  };



  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-foreground">Título da Cápsula</h3>
              <p className="text-muted-foreground">Dê um nome especial que represente este momento único</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Título *
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Carta para meu futuro eu, Lembrança do nosso amor..."
                className={`transition-all duration-200 ${errors.title ? 'border-red-500 focus:border-red-500' : 'focus:border-pink-500'}`}
                maxLength={100}
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.title.message}
                </motion.p>
              )}
              <div className="text-right text-xs text-muted-foreground">
                {(watchedFields.title || '').length}/100
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-foreground">Sua Mensagem</h3>
              <p className="text-muted-foreground">Escreva do coração. Suas palavras serão entregues no futuro</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-foreground">
                Mensagem *
              </Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Querido eu do futuro...\n\nEscreva aqui sua mensagem especial. Conte sobre seus sonhos, sentimentos ou memórias que quer preservar."
                className={`min-h-[120px] transition-all duration-200 ${errors.message ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                maxLength={500}
              />
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.message.message}
                </motion.p>
              )}
              
              {/* Botão de Sugestão IA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getAISuggestion}
                    disabled={isGettingSuggestion || !canUseAI}
                    className="flex items-center gap-2 text-primary border-border hover:bg-muted"
                  >
                    <Wand2 className={`h-4 w-4 ${isGettingSuggestion ? 'animate-spin' : ''}`} />
                    {isGettingSuggestion ? 'Gerando...' : 'Sugestão IA'}
                  </Button>
                  
                  {quota && (
                    <AIQuotaStatus compact onUpgrade={() => onUpgradeRequest && onUpgradeRequest(detectedKeywords)} />
                  )}
                </div>
                
                <div className="text-right text-xs text-muted-foreground">
                  {(watchedFields.message || '').length}/500
                </div>
              </div>
            </div>
            
            {/* Sugestão da IA */}
            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg border border-border bg-muted"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary mb-2">Sugestão da IA ✨</h4>
                      <p className="text-foreground text-sm leading-relaxed mb-3 bg-white/50 p-3 rounded border border-border">
                        {aiSuggestion}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={applySuggestion}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Usar esta sugestão
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setAiSuggestion('')}
                          className="border-border text-primary hover:bg-muted"
                        >
                          Descartar
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-foreground">Programar Entrega</h3>
              <p className="text-muted-foreground">Quando e para quem sua cápsula deve ser entregue</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="text-sm font-medium text-foreground">
                  Data de Entrega *
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  {...register('deliveryDate')}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className={`transition-all duration-200 ${errors.deliveryDate ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                />
                {errors.deliveryDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.deliveryDate.message}
                  </motion.p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipientEmail" className="text-sm font-medium text-foreground">
                  Email do Destinatário *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="recipientEmail"
                    type="email"
                    {...register('recipientEmail')}
                    placeholder="exemplo@email.com"
                    className={`pl-10 transition-all duration-200 ${errors.recipientEmail ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                  />
                </div>
                {errors.recipientEmail && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.recipientEmail.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">
            Criar Cápsula Gratuita
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentStep}/{STEPS.length}
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-1 ${
                  currentStep >= step.id ? 'text-primary font-medium' : ''
                }`}
                >
                <step.icon className="w-3 h-3 text-muted-foreground" />
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
          
          {/* Botões de Navegação */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Criar Cápsula</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};