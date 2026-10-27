import type { FC } from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

// Original JustGrow wordmark and tagline, retained across header and footer.
export const Logo: FC<LogoProps> = ({ variant = 'dark', size = 'md', showTagline = true, className = '' }) => (
  <span className={`brand-logo brand-logo-${variant} brand-logo-${size} ${className}`}>
    <span className="brand-name"><span>Just</span><span className="brand-grow">Grow</span></span>
    {showTagline && <span className="brand-tagline">Grow Smarter. Grow Faster.</span>}
  </span>
);
