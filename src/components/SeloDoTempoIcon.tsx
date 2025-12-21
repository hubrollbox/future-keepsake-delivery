
import React from 'react';

interface SeloDoTempoIconProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'envelope-pink' | 'envelope-black' | 'negative';
}

const SeloDoTempoIcon: React.FC<SeloDoTempoIconProps> = ({ 
  size = 40, 
  className = '', 
  variant = 'default' 
}) => {
  const palette = {
    grayLight: '#F5F5F5',
    grayMid: '#E0E0E0',
    grayDark: '#262626'
  };

  const getEnvelopeColor = () => {
    switch (variant) {
      case 'envelope-black':
        return palette.grayDark;
      case 'negative':
        return palette.grayLight;
      default:
        return palette.grayMid;
    }
  };

  const getStrokeColor = () => {
    return palette.grayDark;
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      role="img"
      aria-label="Selo do Tempo - keepla"
    >
      {/* Círculo externo pontilhado */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.6"
      />
      
      {/* Círculo interno */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth="1.5"
      />
      
      {/* Marcações de tempo (12 traços como relógio) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 50 + Math.cos(angle) * 32;
        const y1 = 50 + Math.sin(angle) * 32;
        const x2 = 50 + Math.cos(angle) * (i % 3 === 0 ? 27 : 29);
        const y2 = 50 + Math.sin(angle) * (i % 3 === 0 ? 27 : 29);
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={getStrokeColor()}
            strokeWidth={i % 3 === 0 ? "2" : "1"}
          />
        );
      })}
      
      {/* Envelope central */}
      <rect
        x="42"
        y="44"
        width="16"
        height="12"
        fill={getEnvelopeColor()}
        stroke={getStrokeColor()}
        strokeWidth="1"
        rx="1"
      />
      
      {/* Aba do envelope */}
      <path
        d="M42 44 L50 50 L58 44"
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth="1"
      />
      
      {/* Texto circular "FUTURO·keeplar" */}
      <defs>
        <path
          id="circle-text"
          d="M 50,50 m -25,0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0"
        />
      </defs>
      
      <text
        fontSize="5"
        fill={getStrokeColor()}
        fontFamily="Fraunces, serif"
        fontWeight="500"
        letterSpacing="0.5"
      >
        <textPath href="#circle-text" startOffset="0%">
          FUTURO·keepla NO
        </textPath>
      </text>
    </svg>
  );
};

export default SeloDoTempoIcon;
