import React from 'react';
import { StatusPillColor } from '../../types';

interface RadialGaugeProps {
  score: number; // 0.0 to 1.0 or 0 to 100
  color?: StatusPillColor | string;
  size?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({ score, color = 'neutral', size = 40 }) => {
  const normalized = score <= 1 ? Math.round(score * 100) : Math.round(score);
  
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  const colorMap: Record<string, string> = {
    recovered: '#12805C',
    pending: '#B45309',
    escalated: '#4338CA',
    stopped: '#6B7280',
    neutral: '#8A8D91',
  };

  const strokeColor = colorMap[color] || '#8A8D91';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E9EAE7"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <span
        className="absolute font-data text-[10px] font-bold text-[#14171A]"
        style={{ letterSpacing: '-0.02em' }}
      >
        {normalized}
      </span>
    </div>
  );
};
