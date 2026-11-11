import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus, Truck, Store, CalendarDays } from 'lucide-react';
import VariantSelector from '@/components/shop/VariantSelector';
import { getProductBySlug, getVariantsForProduct } from '@/lib/repositories/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selected, setSelected] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const { push } = useToast();

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug).then(async (found) => {
      setProduct(found);
      if (found) {
        const list = await getVariantsForProduct(found.id);
        setVariants(list);
        setSelected(list.find((v) => v.stock > 0) ?? list[0] ?? null);
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="display text-xl font-bold text-[var(--text-primary)]">Cargando el producto…</p>
      </div>
    );
  }

  const maxStock = selected?.stock ?? 0;

  const handleAdd = () => {
    if (!selected) return;
    addItem({
      productId: product.id,
      variantId: selected.id,
      size: selected.size,
      quantity,
      name: product.name,
      price: product.price,
      image: product.images[activeImage]?.url ?? product.images[0]?.url ?? '',
    });
    push(`${product.name} agregado al pedido`, 'success');
  };

  return (
    <div className="pt-24 sm:pt-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <nav className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)] mb-8">
          <Link to="/tienda" className="hover:text-[var(--accent-primary)] transition-colors">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-primary)]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] aspect-[4/5] overflow-hidden">
              {product.images[activeImage]?.url && (
                <img
                  src={product.images[activeImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-3">
                {product.images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 border transition-colors ${
                      index === activeImage
                        ? 'border-[var(--accent-primary)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-primary)]'
                    }`}
                    aria-label={`Ver foto ${index + 1}`}
                  >
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--accent-primary)]">{product.category}</p>
            <h1 className="display text-4xl sm:text-5xl font-extrabold leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)] mt-2">
              {product.name}
            </h1>
            <p className="display text-3xl font-bold text-[var(--accent-primary)] mt-4">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="text-[var(--text-secondary)] leading-relaxed max-w-[56ch] mt-6">{product.description}</p>
            )}

            <div className="mt-8 space-y-6">
              <VariantSelector variants={variants} selected={selected?.size ?? null} onSelect={setSelected} />

              <div className="flex items-center gap-4">
                <span className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">Cantidad</span>
                <div className="flex items-center border border-[var(--border-subtle)]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Restar una unidad"
                    className="px-3 py-2 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="mono text-sm px-4 min-w-[2.5rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(Math.max(1, maxStock), q + 1))}
                    aria-label="Sumar una unidad"
                    className="px-3 py-2 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors disabled:opacity-40"
                    disabled={quantity >= maxStock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selected && (
                  <span
                    className={`mono text-[0.65rem] uppercase tracking-[0.12em] ${
                      maxStock > 0 ? 'text-[var(--status-ok)]' : 'text-[var(--status-danger)]'
                    }`}
                  >
                    {maxStock > 0 ? `${maxStock} disponibles` : 'Agotado'}
                  </span>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={!selected || maxStock === 0}
                className="w-full bg-[var(--accent-primary)] text-[var(--text-on-surface)] font-[Fraunces_VF] font-bold py-4 hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {maxStock === 0 ? 'Sin stock por ahora' : 'Agregar al pedido'}
              </button>
            </div>

            <ul className="mt-10 border-t border-[var(--border-subtle)]">
              <li className="flex items-start gap-3 py-4 border-b border-[var(--border-subtle)]">
                <Truck className="h-4 w-4 text-[var(--accent-primary)] mt-0.5" />
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-[Fraunces_VF] font-bold">Envío a todo el país</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                    Coordinamos el envío por WhatsApp después de confirmar el pedido.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 py-4 border-b border-[var(--border-subtle)]">
                <Store className="h-4 w-4 text-[var(--accent-primary)] mt-0.5" />
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-[Fraunces_VF] font-bold">Retiro en Concepción</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">Coordinamos un punto de entrega en la ciudad.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 py-4 border-b border-[var(--border-subtle)]">
                <CalendarDays className="h-4 w-4 text-[var(--accent-primary)] mt-0.5" />
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-[Fraunces_VF] font-bold">Retiro en shows</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                    Llevamos tu pedido al show y lo retirás en el booth.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
