import { Link } from 'react-router-dom';
import type { Show } from '@/types';
import ShowTicket from '@/components/shows/ShowTicket';

export function NextShows({ shows }: { shows: Show[] }) {
  const upcoming = shows.slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="border-b-[length:var(--border-width)] border-[var(--border-primary)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">PRÓXIMAS FECHAS</h2>
            <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-2">
              Agenda 2026 / 2027
            </p>
          </div>
          <Link
            to="/shows"
            className="mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors border-b border-transparent hover:border-[var(--border-primary)] pb-0.5"
          >
            Ver todas las fechas
          </Link>
        </header>

        <div className="space-y-4">
          {upcoming.map((show) => (
            <ShowTicket key={show.id} show={show} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NextShows;
