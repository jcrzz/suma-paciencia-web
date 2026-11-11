import { clsx } from 'clsx';
import { formatDateLong, formatTime } from '@/lib/utils';
import type { Show } from '@/types';

const statusStyles: Record<Show['status'], { label: string; className: string }> = {
  available: { label: 'Entradas disponibles', className: 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]' },
  sold_out: { label: 'Agotado', className: 'bg-[var(--status-danger)] text-[var(--text-on-danger)]' },
  free: { label: 'Entrada libre', className: 'bg-[var(--status-ok)] text-[#F6EFE2]' },
  cancelled: { label: 'Cancelada', className: 'bg-[var(--bg-contrast)] text-[var(--text-on-contrast)]/70' },
};

type Props = {
  show: Show;
  isPast?: boolean;
};

export function ShowTicket({ show, isPast = false }: Props) {
  const status = statusStyles[show.status] ?? statusStyles.available;
  const date = formatDateLong(show.show_date);

  return (
    <article
      className={clsx(
        'relative grid grid-cols-1 sm:grid-cols-[150px_1fr_auto] items-stretch gap-0 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)]',
        isPast && 'opacity-55'
      )}
    >
      <div className="relative px-5 py-5 sm:py-6 border-b sm:border-b-0 sm:border-r border-[var(--border-subtle)] text-center">
        <span className="mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--text-on-surface-secondary)] block">
          {date.weekday}
        </span>
        <span className="display text-5xl font-bold leading-none text-[var(--text-on-surface)] block mt-1">
          {date.day}
        </span>
        <span className="mono text-[0.68rem] uppercase tracking-[0.15em] text-[var(--accent-primary)] block mt-1">
          {date.monthYear}
        </span>
      </div>

      <div className="px-5 py-5 sm:py-6 flex flex-col justify-center gap-1.5">
        <h3 className="display text-xl sm:text-2xl font-bold text-[var(--text-on-surface)] leading-tight">{show.city}</h3>
        <p className="text-sm text-[var(--text-on-surface-secondary)]">{show.venue}</p>
        <p className="mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)]">
          {show.province} · {formatTime(show.show_date)} hs
        </p>
      </div>

      <div className="px-5 py-5 sm:py-6 flex items-center sm:justify-end gap-3 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)]">
        <span className={clsx('mono text-[0.65rem] uppercase tracking-[0.12em] px-3 py-1.5', status.className)}>
          {status.label}
        </span>
        {show.ticket_url && !isPast && (
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[0.65rem] uppercase tracking-[0.12em] px-3 py-1.5 border border-[var(--border-primary)] text-[var(--text-on-surface)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
          >
            Comprar
          </a>
        )}
      </div>

      <span aria-hidden className="absolute left-[150px] top-0 bottom-0 hidden sm:block border-l border-dashed border-[var(--border-subtle)]" />
    </article>
  );
}

export default ShowTicket;
