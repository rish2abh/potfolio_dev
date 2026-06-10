'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  href,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:ring-offset-2 focus:ring-offset-dark-base';

  const variants = {
    primary:
      'bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] glow-neon-idle hover:bg-[#00d4ff]/15 hover:border-[#00d4ff]/60 hover:scale-[1.02] hover:glow-neon-hover active:scale-[0.98] active:shadow-[0_0_8px_rgba(0,212,255,0.2)] transition-all duration-200 ease-out',
    secondary:
      'bg-dark-card border border-neon-blue/30 text-neon-blue hover:glow-neon-hover hover:border-neon-blue/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out',
    outline:
      'bg-transparent border border-neon-purple/40 text-neon-purple hover:glow-neon-hover hover:border-neon-purple/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
