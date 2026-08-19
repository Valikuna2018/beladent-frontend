import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={`glass-panel ${hoverEffect ? 'glass-panel-hover animate-fade-in' : 'animate-fade-in'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
