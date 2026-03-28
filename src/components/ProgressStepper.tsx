import React from 'react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="stepper flex justify-between items-center mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isActive = isCompleted || isCurrent;
        
        return (
          <div 
            key={step} 
            className={`step flex flex-col items-center ${isActive ? 'active' : ''}`}
          >
            <div 
              className={`step-number flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors duration-300 ${
                isActive 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-white border-border text-foreground'
              }`}
            >
              {stepNumber}
            </div>
            <div 
              className={`step-label mt-2 text-sm transition-colors duration-300 ${
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;