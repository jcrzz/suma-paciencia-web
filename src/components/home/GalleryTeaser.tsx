import { Link } from 'react-router-dom';
import type { GalleryItem } from '@/types';

export function GalleryTeaser({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  const picks = items.slice(0, 3);

  return (
    <section className="border-b-[length:var(--border-width)] border-[var(--border-primary)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="display text-3xl sm:text-4xl font-bold text-[var(--text-on-contrast)]">GALERÍA</h2>
            <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-2">
              Fotos y videos de la banda en vivo
            </p>
          </div>
          <Link
            to="/galeria"
            className="mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent-primary)] hover:text-[var(--text-on-contrast)] transition-colors border-b border-transparent hover:border-[var(--border-primary)] pb-0.5"
          >
            Ver la galería
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-12 sm:auto-rows-[160px]">
          {picks.map((item, index) => (
            <Link
              key={item.id}
              to="/galeria"
              className={`group relative overflow-hidden border-[length:var(--border-width)] border-[var(--border-primary)] ${
                index === 0 ? 'sm:col-span-7 sm:row-span-3' : index === 1 ? 'sm:col-span-5 sm:row-span-2' : 'sm:col-span-5 sm:row-span-1'
              }`}
            >
              <img
                src={item.image_url}
                alt={item.title ?? ''}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-[var(--bg-contrast)]/85 px-4 py-2 mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-on-contrast)]">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GalleryTeaser;
