import { clsx } from 'clsx';
import type { ProductVariant } from '@/types';

type Props = {
  variants: ProductVariant[];
  selected: string | null;
  onSelect: (variant: ProductVariant) => void;
  size?: 'sm' | 'md';
};

export function VariantSelector({ variants, selected, onSelect, size = 'md' }: Props) {
  if (variants.length === 0) return null;

  return (
    <div>
      <span className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)] block mb-2">
        Talla
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Elegí la talla">
        {variants.map((variant) => {
          const soldOut = variant.stock <= 0;
          const isSelected = selected === variant.size;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !soldOut && onSelect(variant)}
              disabled={soldOut}
              aria-pressed={isSelected}
              className={clsx(
                'border transition-colors mono focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]',
                size === 'sm' ? 'text-[0.68rem] px-2.5 py-1.5' : 'text-xs px-3.5 py-2',
                isSelected
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] border-[var(--border-primary)]'
                  : soldOut
                    ? 'border-[var(--border-subtle)] text-[var(--text-on-surface)]/50 line-through cursor-not-allowed'
                    : 'border-[var(--border-primary)] text-[var(--text-on-surface)] hover:bg-[var(--accent-secondary)]'
              )}
            >
              {variant.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
