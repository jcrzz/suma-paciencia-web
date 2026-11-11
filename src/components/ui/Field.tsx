import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

const base =
  'w-full bg-[var(--bg-surface)] border-[length:var(--border-width)] border-[var(--border-primary)] px-3.5 py-2.5 text-[var(--text-on-surface)] placeholder:text-[var(--text-on-surface-secondary)]/60 focus:outline-none focus:outline-2 focus:outline-offset-1 focus:outline-[var(--accent-primary)] transition-colors';

type Wrapper = { label?: string; error?: string; hint?: string; className?: string };
type SelectWrapper = Wrapper & { options?: { value: string; label: string }[] };

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & Wrapper) {
  return (
    <label className={clsx('block', className)} htmlFor={id}>
      {label && (
        <span className="mb-1.5 block mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {label}
        </span>
      )}
      <input id={id} className={clsx(base, error && 'border-[var(--status-danger)]')} {...props} />
      {hint && !error && <span className="mt-1 block text-xs text-[var(--text-secondary)]">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-[var(--status-danger)]">{error}</span>}
    </label>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & Wrapper) {
  return (
    <label className={clsx('block', className)} htmlFor={id}>
      {label && (
        <span className="mb-1.5 block mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {label}
        </span>
      )}
      <textarea id={id} className={clsx(base, 'min-h-[110px] resize-y', error && 'border-[var(--status-danger)]')} {...props} />
      {hint && !error && <span className="mt-1 block text-xs text-[var(--text-secondary)]">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-[var(--status-danger)]">{error}</span>}
    </label>
  );
}

export function Select({
  label,
  error,
  hint,
  className,
  id,
  options,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & SelectWrapper) {
  return (
    <label className={clsx('block', className)} htmlFor={id}>
      {label && (
        <span className="mb-1.5 block mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {label}
        </span>
      )}
      <select id={id} className={clsx(base, 'appearance-none', error && 'border-[var(--status-danger)]')} {...props}>
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {hint && !error && <span className="mt-1 block text-xs text-[var(--text-secondary)]">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-[var(--status-danger)]">{error}</span>}
    </label>
  );
}
