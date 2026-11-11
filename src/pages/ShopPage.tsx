import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import VariantSelector from '@/components/shop/VariantSelector';
import { getActiveProducts, getVariants } from '@/lib/repositories/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import type { Product, ProductVariant } from '@/types';

const CATEGORIES = [
  { key: 'todos', label: 'Todo' },
  { key: 'indumentaria', label: 'Indumentaria' },
  { key: 'discos', label: 'Discos y físico' },
  { key: 'accesorios', label: 'Accesorios' },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [category, setCategory] = useState('todos');
  const [selected, setSelected] = useState<Record<string, ProductVariant>>({});
  const { addItem } = useCart();
  const { push } = useToast();

  useEffect(() => {
    getActiveProducts().then(setProducts).catch(() => setProducts([]));
    getVariants().then(setVariants).catch(() => setVariants([]));
  }, []);

  const visible = useMemo(
    () => (category === 'todos' ? products : products.filter((p) => p.category === category)),
    [products, category]
  );

  const variantsOf = (productId: string) => variants.filter((v) => v.product_id === productId);

  const handleAdd = (product: Product) => {
    const list = variantsOf(product.id);
    const chosen = selected[product.id];
    const variant = chosen ?? list.find((v) => v.stock > 0);
    if (!variant) {
      push('No hay stock disponible por el momento', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: variant.id,
      size: variant.size,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url ?? '',
    });
    push(`${product.name} agregado al pedido`, 'success');
  };

  return (
    <div className="pt-24 sm:pt-28">
      <header className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8 border-b border-[var(--border-subtle)]">
        <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Tienda oficial</p>
        <h1 className="display text-[clamp(2.4rem,8vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
          MERCH
        </h1>
        <p className="text-[var(--text-secondary)] max-w-[62ch] mt-4 leading-relaxed">
          Remeras, discos y accesorios de la banda. Envíos a todo el país o retiro en Concepción del Uruguay
          y en las fechas. El stock se descuenta cuando confirmamos tu pedido.
        </p>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtrar por categoría">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`mono text-[0.68rem] uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${
                category === cat.key
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-surface)] border-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-primary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-[var(--border-subtle)] px-6 py-16 text-center">
            <p className="display text-xl font-bold text-[var(--text-primary)]">No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {visible.map((product) => {
              const list = variantsOf(product.id);
              const chosen = selected[product.id];
              const totalStock = list.reduce((sum, v) => sum + v.stock, 0);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  image={product.images[0]?.url ?? ''}
                  variantLabel={list.length > 1 ? `${list.length} talles` : list[0]?.size}
                  stockLabel={totalStock > 0 ? `${totalStock} en stock` : 'Agotado'}
                  cta={
                    <div className="space-y-3">
                      {list.length > 0 && (
                        <VariantSelector
                          size="sm"
                          variants={list}
                          selected={chosen?.size ?? null}
                          onSelect={(variant) =>
                            setSelected((current) => ({ ...current, [product.id]: variant }))
                          }
                        />
                      )}
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={totalStock === 0}
                        className="w-full mono text-[0.68rem] uppercase tracking-[0.14em] bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] py-2.5 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      >
                        {totalStock === 0 ? 'Agotado' : 'Agregar al pedido'}
                        {totalStock > 0 && <Check className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
