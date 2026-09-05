import React from 'react';
import { StatusPillColor } from '../../types';

interface StatusPillProps {
  label: string;
  color?: StatusPillColor | string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ label, color = 'neutral', className = '' }) => {
  const pillClasses: Record<string, string> = {
    recovered: 'pill-recovered',
    pending: 'pill-pending',
    escalated: 'pill-escalated',
    stopped: 'pill-stopped',
    neutral: 'pill-neutral',
  };

  const pillClass = pillClasses[color] || pillClasses.neutral;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[11px] font-semibold tracking-wide capitalize font-ui ${pillClass} ${className}`}
    >
      {label.replace(/_/g, ' ').toLowerCase()}
    </span>
  );
};
