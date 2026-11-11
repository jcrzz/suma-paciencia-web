import { useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, cartCount } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[120] transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isOpen}
    >
      <button
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-[#141817]/70 backdrop-blur-[2px] cursor-default"
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`absolute right-0 top-0 h-full w-full max-w-[440px] bg-[var(--bg-surface)] text-[var(--text-on-surface)] border-l-[length:var(--border-width)] border-[var(--border-primary)] flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b-[length:var(--border-width)] border-[var(--border-primary)]">
          <h2 className="display text-xl font-bold">Tu pedido</h2>
          <button onClick={closeCart} aria-label="Cerrar carrito" className="p-1 hover:bg-[var(--bg-surface-alt)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-[var(--text-on-surface-secondary)]">Todavía no agregaste nada.</p>
            <Link
              to="/tienda"
              onClick={closeCart}
              className="border-[length:var(--border-width)] border-[var(--border-primary)] px-5 py-2 font-[Fraunces_VF] font-bold text-sm hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
            >
              Ver la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)]">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="px-5 py-4 flex gap-4">
                  <div className="w-16 h-20 shrink-0 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <p className="font-[Fraunces_VF] font-bold text-sm leading-tight">{item.name}</p>
                      <p className="mono text-xs whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <p className="mono text-[0.7rem] text-[var(--text-on-surface-secondary)] mt-1">Talle {item.size}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-[var(--border-subtle)]">
                        <button
                          onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                          aria-label="Restar una unidad"
                          className="px-2 py-1 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="mono text-xs px-2 min-w-[1.75rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                          aria-label="Sumar una unidad"
                          className="px-2 py-1 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label={`Quitar ${item.name} del carrito`}
                        className="text-[var(--text-on-surface-secondary)] hover:text-[var(--status-danger)] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t-[length:var(--border-width)] border-[var(--border-primary)] px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="mono text-xs uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)]">Total</span>
                <span className="display text-2xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-[var(--text-on-surface-secondary)] leading-relaxed">
                Envíos a todo el país o retiro en Concepción del Uruguay y en fechas. El envío se coordina por WhatsApp.
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-center font-[Fraunces_VF] font-bold py-3.5 border-[length:var(--border-width)] border-[var(--border-primary)] hover:bg-[var(--accent-secondary)] transition-colors"
              >
                Finalizar compra ({cartCount})
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
