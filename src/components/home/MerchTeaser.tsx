import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPricePlain } from '@/lib/utils';

export function MerchTeaser({ products }: { products: Product[] }) {
  const featured = products.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section className="bg-[var(--bg-secondary)] border-b-[length:var(--border-width)] border-[var(--border-primary)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">TIENDA OFICIAL</h2>
            <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-2">
              Merchandising de la banda
            </p>
          </div>
          <Link
            to="/tienda"
            className="mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors border-b border-transparent hover:border-[var(--border-primary)] pb-0.5"
          >
            Ir a la tienda
          </Link>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((product) => (
            <Link
              key={product.id}
              to={`/tienda/${product.slug}`}
              className="group border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)] hover:-translate-y-0.5 transition-all"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)]">
                {product.images[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="flex items-baseline justify-between gap-3 p-4">
                <h3 className="display font-bold text-[var(--text-on-surface)] text-lg">{product.name}</h3>
                <span className="mono text-sm text-[var(--accent-primary)]">{formatPricePlain(product.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MerchTeaser;
