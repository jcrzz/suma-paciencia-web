import React from 'react';
import { clsx } from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
};

export function Button({
  variant = 'solid',
  size = 'md',
  full = false,
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-[Fraunces_VF] font-bold tracking-tight transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]';

  const variants: Record<string, string> = {
    solid:
      'bg-[var(--accent-primary)] text-[var(--text-on-accent)] border-[length:var(--border-width)] border-[var(--border-primary)] shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:bg-[var(--accent-secondary)]',
    outline:
      'border-[length:var(--border-width)] border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-on-surface)]',
    ghost:
      'text-[var(--text-primary)] hover:text-[var(--accent-primary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:decoration-[var(--accent-primary)]',
    danger:
      'bg-[var(--status-danger)] text-[var(--text-on-danger)] border-[length:var(--border-width)] border-[var(--border-primary)] shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:opacity-85',
  };

  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], full && 'w-full', className)}
      {...props}
    />
  );
}

export default Button;
