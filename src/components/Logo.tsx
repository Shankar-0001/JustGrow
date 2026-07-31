import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isDarkBg = variant === 'light'; // light text for dark backgrounds

  const textSizeClass = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  const taglineSizeClass = {
    sm: 'text-[10px] sm:text-[11px]',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg',
  }[size];

  return (
    <div className={`inline-flex flex-col text-left select-none ${className}`}>
      <div className={`font-heading font-extrabold ${textSizeClass} leading-none tracking-tight flex items-baseline`}>
        <span className={isDarkBg ? 'text-white' : 'text-slate-900'}>Just</span>
        <span className="text-blue-600">Grow</span>
      </div>
      {showTagline && (
        <span
          className={`font-sans font-medium ${taglineSizeClass} ${
            isDarkBg ? 'text-slate-300' : 'text-slate-500'
          } tracking-tight mt-1 block whitespace-nowrap`}
        >
          Grow Smarter. Grow Faster.
        </span>
      )}
    </div>
  );
};

