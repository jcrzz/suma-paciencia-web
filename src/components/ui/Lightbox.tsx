import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Item = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string | null;
};

type Props = {
  items: Item[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[140] bg-[#141817]/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 text-[#F6EFE2]">
        <span className="mono text-xs uppercase tracking-[0.14em]">
          {index + 1} / {items.length}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Cerrar"
          className="p-2 hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + items.length) % items.length);
          }}
          aria-label="Anterior"
          className="absolute left-2 sm:left-6 z-10 p-3 bg-[#F6EFE2] text-[#141817] border-2 border-[#141817] hover:-translate-y-0.5 transition-transform"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <img
          src={item.src}
          alt={item.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[70vh] max-w-full object-contain border-[3px] border-[#F6EFE2]"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % items.length);
          }}
          aria-label="Siguiente"
          className="absolute right-2 sm:right-6 z-10 p-3 bg-[#F6EFE2] text-[#141817] border-2 border-[#141817] hover:-translate-y-0.5 transition-transform"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {(item.caption || item.credit) && (
        <div className="px-5 pb-8 text-center text-[#F6EFE2]" onClick={(e) => e.stopPropagation()}>
          {item.caption && <p className="text-sm">{item.caption}</p>}
          {item.credit && <p className="mono text-[0.6rem] uppercase tracking-[0.14em] opacity-60 mt-1">{item.credit}</p>}
        </div>
      )}
    </div>
  );
}
