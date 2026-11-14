import { clsx } from 'clsx';
import { Ticket } from 'lucide-react';
import { formatDateLong, formatTime } from '@/lib/utils';
import type { Show } from '@/types';

const statusStyles: Record<Show['status'], { label: string; short: string; className: string }> = {
  available: {
    label: 'Entradas disponibles',
    short: 'Entradas',
    className: 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]',
  },
  sold_out: { label: 'Agotado', short: 'Agotado', className: 'bg-[var(--status-danger)] text-[var(--text-on-danger)]' },
  free: { label: 'Entrada libre', short: 'Libre', className: 'bg-[var(--status-ok)] text-[#F6EFE2]' },
  cancelled: {
    label: 'Cancelada',
    short: 'Cancelada',
    className: 'bg-[var(--bg-contrast)] text-[var(--text-on-contrast)]/70',
  },
};

type Props = {
  show: Show;
  isPast?: boolean;
};

export function ShowTicket({ show, isPast = false }: Props) {
  const status = statusStyles[show.status] ?? statusStyles.available;
  const date = formatDateLong(show.show_date);
  const ticketUrl = isPast ? null : show.ticket_url;

  return (
    <article
      className={clsx(
        'flex w-full flex-row items-center justify-between gap-0 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] p-3 text-[var(--text-on-surface)] sm:p-4',
        isPast && 'opacity-55'
      )}
    >
      <div className="mr-3 flex w-[4.5rem] shrink-0 flex-col items-center justify-center border-r border-dashed border-[var(--border-subtle)] pr-3 text-center sm:mr-4 sm:w-20 sm:pr-4">
        <span className="mono block text-[0.55rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)] sm:text-[0.62rem] sm:tracking-[0.2em]">
          {date.weekday}
        </span>
        <span className="display mt-0.5 block text-3xl font-bold leading-none text-[var(--text-on-surface)] sm:mt-1 sm:text-5xl">
          {date.day}
        </span>
        <span className="mono mt-0.5 block text-[0.6rem] uppercase tracking-[0.12em] text-[var(--accent-primary)] sm:mt-1 sm:text-[0.68rem] sm:tracking-[0.15em]">
          {date.monthYear}
        </span>
      </div>

      <div className="flex min-w-0 grow flex-col gap-0.5 text-left sm:gap-1.5">
        <h3 className="display truncate text-base font-bold leading-tight text-[var(--text-on-surface)] sm:text-xl md:text-2xl">
          {show.city}
        </h3>
        <p className="truncate text-xs text-[var(--text-on-surface-secondary)] sm:text-sm">{show.venue}</p>
        <p className="mono truncate text-[0.62rem] uppercase tracking-[0.1em] text-[var(--text-on-surface-secondary)] sm:text-[0.7rem] sm:tracking-[0.12em]">
          {show.province} · {formatTime(show.show_date)} hs
        </p>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-2 sm:ml-3 sm:gap-3">
        <span
          className={clsx(
            'mono hidden px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.12em] sm:inline-block',
            status.className
          )}
        >
          {status.label}
        </span>

        {ticketUrl ? (
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Comprar entradas para ${show.city}`}
            className="mono inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border-primary)] text-[var(--text-on-surface)] transition-colors hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[0.65rem] sm:uppercase sm:tracking-[0.12em]"
          >
            <Ticket className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Comprar</span>
          </a>
        ) : (
          <span
            className={clsx(
              'mono px-2 py-1 text-[0.58rem] uppercase tracking-[0.1em] sm:hidden',
              status.className
            )}
          >
            {status.short}
          </span>
        )}
      </div>
    </article>
  );
}

export default ShowTicket;
