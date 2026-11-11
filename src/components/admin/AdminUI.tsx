import type { ReactNode } from 'react';

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[var(--line-light)] mb-8">
      <div>
        <h1 className="display text-3xl sm:text-4xl font-bold text-[var(--paper)]">{title}</h1>
        {description && <p className="text-[var(--muted)] mt-2 max-w-[64ch] text-sm leading-relaxed">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function Metric({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'warning' | 'ok';
}) {
  const tones = {
    default: 'text-[var(--paper)]',
    warning: 'text-[var(--terracota)]',
    ok: 'text-[var(--oliva)]',
  };

  return (
    <div className="border border-[var(--line-light)] bg-[var(--monte)]/50 p-5">
      <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className={`display text-3xl font-bold mt-2 ${tones[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-[var(--muted)] mt-1.5">{hint}</p>}
    </div>
  );
}

export function AdminEmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="border border-dashed border-[var(--line-light)] px-6 py-14 text-center">
      <p className="display text-lg font-bold text-[var(--paper)]">{title}</p>
      {hint && <p className="text-sm text-[var(--muted)] mt-2">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default AdminPageHeader;
