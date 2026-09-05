import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryFigureProps {
  label: string;
  value: string | number;
  hero?: boolean;
  accentValue?: string;
  icon?: LucideIcon;
  iconColor?: string;
  color?: string;
  className?: string;
}

export const SummaryFigure: React.FC<SummaryFigureProps> = ({
  label,
  value,
  hero = false,
  accentValue,
  icon: Icon,
  iconColor = 'var(--color-ink-secondary)',
  color = 'var(--color-ink)',
  className = '',
}) => {
  return (
    <div className={`flex flex-col justify-center px-4 py-2 ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium text-[var(--color-ink-secondary)] font-ui">
          {label}
        </span>
        {Icon && (
          <Icon className="w-4 h-4 shrink-0" style={{ color: iconColor }} />
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span
          className={`font-display font-semibold tracking-tight ${
            hero ? 'text-[38px] sm:text-[42px] leading-tight' : 'text-[26px] sm:text-[28px] leading-tight'
          }`}
          style={{ color }}
        >
          {value}
        </span>

        {accentValue && (
          <span
            className="font-display italic font-normal text-[18px] sm:text-[20px] text-[var(--color-recovered)] tracking-tight ml-1.5"
          >
            {accentValue}
          </span>
        )}
      </div>
    </div>
  );
};
