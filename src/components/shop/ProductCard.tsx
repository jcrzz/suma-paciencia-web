import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

type Props = {
  product: Product;
  image: string;
  variantLabel?: string;
  stockLabel?: string;
  cta?: React.ReactNode;
};

export default function ProductCard({ product, image, variantLabel, stockLabel, cta }: Props) {
  return (
    <article className="group relative flex flex-col border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] hover:-translate-y-0.5 hover:shadow-[var(--card-shadow)] transition-colors">
      <Link to={`/tienda/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display font-bold text-[var(--text-on-surface)] text-lg leading-tight">
            <Link to={`/tienda/${product.slug}`} className="hover:text-[var(--accent-primary)] transition-colors">
              {product.name}
            </Link>
          </h3>
          <span className="mono text-sm text-[var(--accent-primary)] whitespace-nowrap">{formatPrice(product.price)}</span>
        </div>

        {product.description && (
          <p className="text-sm text-[var(--text-on-surface-secondary)] leading-relaxed line-clamp-2">{product.description}</p>
        )}

        <div className="mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)] flex gap-3 flex-wrap">
          <span>{product.category}</span>
          {variantLabel && <span>{variantLabel}</span>}
          {stockLabel && <span className={stockLabel === 'Agotado' ? 'text-[var(--status-danger)]' : ''}>{stockLabel}</span>}
        </div>

        <div className="mt-auto pt-3">{cta}</div>
      </div>
    </article>
  );
}
