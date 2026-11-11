import { useEffect, useMemo, useState } from 'react';
import ShowTicket from '@/components/shows/ShowTicket';
import { getPublishedShows } from '@/lib/repositories/shows';
import type { Show } from '@/types';

type Filter = 'all' | 'upcoming' | 'past';

type Buckets = {
  upcoming: Show[];
  past: Show[];
};

export default function ShowsPage() {
  const [buckets, setBuckets] = useState<Buckets>({ upcoming: [], past: [] });
  const [filter, setFilter] = useState<Filter>('upcoming');

  useEffect(() => {
    getPublishedShows()
      .then((list) => {
        const now = Date.now();
        setBuckets({
          upcoming: list.filter((show) => new Date(show.show_date).getTime() >= now),
          past: list.filter((show) => new Date(show.show_date).getTime() < now).reverse(),
        });
      })
      .catch(() => setBuckets({ upcoming: [], past: [] }));
  }, []);

  const { upcoming, past } = buckets;
  const visible = useMemo(
    () => (filter === 'all' ? [...upcoming, ...past] : filter === 'upcoming' ? upcoming : past),
    [filter, upcoming, past]
  );

  const filters: { key: Filter; label: string }[] = [
    { key: 'upcoming', label: `Próximas (${upcoming.length})` },
    { key: 'past', label: `Pasadas (${past.length})` },
    { key: 'all', label: `Todas (${upcoming.length + past.length})` },
  ];

  return (
    <div className="pt-24 sm:pt-28">
      <header className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8 border-b border-[var(--border-subtle)]">
        <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Agenda</p>
        <h1 className="display text-[clamp(2.4rem,8vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
          FECHAS
        </h1>
        <p className="text-[var(--text-secondary)] max-w-[62ch] mt-4 leading-relaxed">
          Donde tocan Suma Paciencia. Las entradas se compran en el link de cada fecha; para consultas,
          escribinos por WhatsApp.
        </p>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filtrar fechas">
          {filters.map((item) => (
            <button
              key={item.key}
              role="tab"
              aria-selected={filter === item.key}
              onClick={() => setFilter(item.key)}
              className={`mono text-[0.68rem] uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${
                filter === item.key
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-surface)] border-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-primary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-[var(--border-subtle)] px-6 py-16 text-center">
            <p className="display text-xl font-bold text-[var(--text-primary)]">Todavía no hay fechas cargadas</p>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              Sumate a la lista por Instagram para enterarte cuando confirmemos la próxima.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((show) => (
              <ShowTicket
                key={show.id}
                show={show}
                isPast={past.some((item) => item.id === show.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
