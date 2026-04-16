import { useState, useEffect } from 'react';

const TOUR_KEY = 'keepla_tour_completed';

interface GuidedTourProps {
  run?: boolean;
  onComplete?: () => void;
}

interface TourStep {
  target: string;
  content: string;
  placement: string;
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="profile"]',
    content: 'Aqui podes ver o teu perfil, nível e pontos acumulados. Quanto mais usas a Keepla, mais recompensas ganhas!',
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
    const tourCompleted = localStorage.getItem(TOUR_KEY);
    if (externalRun !== undefined) {
      setRun(externalRun);
    } else if (!tourCompleted) {
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [externalRun]);

  const handleFinish = () => {
    setRun(false);
    localStorage.setItem(TOUR_KEY, 'true');
    onComplete?.();
  };

  if (!run || stepIndex >= tourSteps.length) return null;

  const step = tourSteps[stepIndex]!;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={handleFinish} />
      {/* Tooltip */}
      <div className="fixed z-[10000] bottom-4 left-4 right-4 mx-auto max-w-sm bg-white rounded-xl p-5 shadow-2xl">
        <p className="text-sm text-foreground leading-relaxed mb-4">{step.content}</p>
        <div className="flex items-center justify-between">
          <button onClick={handleFinish} className="text-xs text-muted-foreground hover:underline">
            Saltar tour
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{stepIndex + 1}/{tourSteps.length}</span>
            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex(i => i - 1)}
                className="px-3 py-1.5 text-xs rounded-md border border-border"
              >
                Anterior
              </button>
            )}
            <button
              onClick={() => {
                if (stepIndex < tourSteps.length - 1) {
                  setStepIndex(i => i + 1);
                } else {
                  handleFinish();
                }
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground"
            >
              {stepIndex < tourSteps.length - 1 ? 'Seguinte' : 'Concluir'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

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
