import { ReactNode } from 'react';

interface ScallopedCardProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;
}

export function ScallopedCard({ children, className = '', bgColor = 'white' }: ScallopedCardProps) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}>
        <defs>
          <clipPath id={`scallop-${Math.random()}`}>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx="20"
            />
          </clipPath>
        </defs>
      </svg>
      <div 
        className="relative border-4 border-white shadow-lg"
        style={{ 
          borderRadius: '20px',
          background: bgColor,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 0 0 3px rgba(255,255,255,0.5)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
