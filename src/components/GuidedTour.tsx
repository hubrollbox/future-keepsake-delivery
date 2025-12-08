import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const TOUR_KEY = 'keepla_tour_completed';

interface GuidedTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const tourSteps: Step[] = [
  {
    target: '[data-tour="profile"]',
    content: 'Aqui podes ver o teu perfil, nível e pontos acumulados. Quanto mais usas a Keepla, mais recompensas ganhas!',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="create-keepsake"]',
    content: 'Clica aqui para criar o teu primeiro keepsake. Guarda uma memória hoje e entrega-a no momento certo.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="keepsakes-list"]',
    content: 'Todos os teus keepsakes aparecem aqui. Podes filtrar por estado: pendentes, agendados ou enviados.',
    placement: 'top',
  },
  {
    target: '[data-tour="stats"]',
    content: 'Acompanha as tuas estatísticas: total de keepsakes, pontos e nível atual.',
    placement: 'left',
  },
];

export default function GuidedTour({ run: externalRun, onComplete }: GuidedTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Check if tour was already completed
    const tourCompleted = localStorage.getItem(TOUR_KEY);
    
    if (externalRun !== undefined) {
      setRun(externalRun);
    } else if (!tourCompleted) {
      // Auto-start tour for first-time users after a short delay
      const timer = setTimeout(() => {
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [externalRun]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_KEY, 'true');
      onComplete?.();
    }

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      callback={handleJoyrideCallback}
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Concluir',
        next: 'Seguinte',
        skip: 'Saltar tour',
      }}
      styles={{
        options: {
          primaryColor: '#E63946',
          textColor: '#000000',
          backgroundColor: '#FFFFFF',
          arrowColor: '#FFFFFF',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: '#E63946',
          color: '#FFFFFF',
          borderRadius: '0.5rem',
          padding: '0.75rem 1.5rem',
        },
        buttonBack: {
          color: '#000000',
          marginRight: '0.5rem',
        },
        buttonSkip: {
          color: '#666666',
        },
        tooltip: {
          borderRadius: '0.75rem',
          padding: '1.5rem',
        },
        tooltipContent: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.95rem',
          lineHeight: '1.5',
        },
      }}
    />
  );
}

// Hook to manually trigger tour
export function useTour() {
  const [shouldRun, setShouldRun] = useState(false);

  const startTour = () => {
    localStorage.removeItem(TOUR_KEY);
    setShouldRun(true);
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_KEY);
  };

  return { shouldRun, startTour, resetTour };
}
