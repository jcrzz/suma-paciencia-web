import { useEffect, useMemo, useState } from 'react';
import Lightbox from '@/components/ui/Lightbox';
import { getPublishedGallery } from '@/lib/repositories/gallery';
import type { GalleryItem } from '@/types';

const CATEGORIES = ['todos', 'vivo', 'ensayo', 'backstage', 'prensa'];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState('todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getPublishedGallery().then(setItems).catch(() => setItems([]));
  }, []);

  const visible = useMemo(
    () => (category === 'todos' ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  const lightboxItems = visible.map((i) => ({
    src: i.image_url,
    alt: i.title ?? 'Foto de Suma Paciencia',
    caption: i.title ?? undefined,
  }));

  return (
    <div className="pt-24 sm:pt-28">
      <header className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8 border-b border-[var(--border-subtle)]">
        <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Fotos y videos</p>
        <h1 className="display text-[clamp(2.4rem,8vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
          GALERÍA
        </h1>
        <p className="text-[var(--text-secondary)] max-w-[62ch] mt-4 leading-relaxed">
          Contacto, soundcheck y noches de show. Las imágenes de esta galería son de muestra:
          reemplazalas desde el panel de administración con el material real de la banda.
        </p>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`mono text-[0.68rem] uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${
                category === cat
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-surface)] border-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-primary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'todos' ? 'Todas' : cat}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-[var(--border-subtle)] px-6 py-16 text-center">
            <p className="display text-xl font-bold text-[var(--text-primary)]">Todavía no hay fotos cargadas</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {visible.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="block w-full break-inside-avoid group relative overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors"
              >
                <img
                  src={item.image_url}
                  alt={item.title ?? ''}
                  loading="lazy"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-[var(--bg-contrast)]/88 px-3 py-2 text-left">
                  <span className="block mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--text-on-contrast)]">
                    {item.title}
                  </span>
                  <span className="block mono text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-on-contrast)]/70 mt-0.5">
                    {item.category}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
