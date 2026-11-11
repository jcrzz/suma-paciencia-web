import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[#141817]/75 backdrop-blur-[2px] cursor-default"
      />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'relative w-full bg-[var(--bg-surface)] text-[var(--text-on-surface)] border-[length:var(--border-width)] border-[var(--border-primary)] shadow-[var(--card-shadow)] max-h-[92vh] overflow-y-auto',
          widths[size]
        )}
      >
        <header className="sticky top-0 bg-[var(--bg-surface)] border-b-[length:var(--border-width)] border-[var(--border-primary)] px-5 sm:px-7 py-4 flex items-start justify-between gap-4 z-10">
          <h2 className="display text-lg sm:text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="p-1 hover:bg-[var(--bg-surface-alt)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="px-5 sm:px-7 py-5">{children}</div>
        {footer && (
          <footer className="sticky bottom-0 bg-[var(--bg-surface)] border-t-[length:var(--border-width)] border-[var(--border-primary)] px-5 sm:px-7 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export default Modal;
