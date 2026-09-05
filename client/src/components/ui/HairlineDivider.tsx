import React from 'react';

interface HairlineDividerProps {
  vertical?: boolean;
  className?: string;
}

export const HairlineDivider: React.FC<HairlineDividerProps> = ({ vertical = false, className = '' }) => {
  if (vertical) {
    return <div className={`w-[1px] self-stretch bg-[var(--color-border)] ${className}`} />;
  }
  return <div className={`h-[1px] w-full bg-[var(--color-border)] ${className}`} />;
};
