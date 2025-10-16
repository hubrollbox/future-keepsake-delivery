import React from 'react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="stepper flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div 
          key={step} 
          className={`step flex flex-col items-center ${index <= currentStep ? 'active' : ''}`}
        >
          <div 
            className={`step-number flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-700 font-bold transition-colors duration-300 ${
              index <= currentStep ? 'bg-keepla-red border-keepla-red text-white' : 'bg-white'
            }`}
          >
            {index + 1}
          </div>
          <div 
            className={`step-label mt-2 text-sm text-gray-600 transition-colors duration-300 ${
              index <= currentStep ? 'text-keepla-red font-semibold' : ''
            }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressStepper;