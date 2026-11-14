import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import BandLogo from '@/components/ui/BandLogo';
import EraSwitcher from '@/components/layout/EraSwitcher';

const NAV_LINKS = [
  { label: 'Fechas', href: '/shows' },
  { label: 'Música', href: '/musica' },
  { label: 'Galería', href: '/galeria' },
  { label: 'EPK', href: '/epk' },
  { label: 'Tienda', href: '/tienda' },
];

export default function Navbar() {
  const { cartCount, openCart } = useCart();
  const location = useLocation();
  const [menu, setMenu] = useState({ open: false, path: location.pathname });
  const open = menu.open && menu.path === location.pathname;
  const setOpen = (value: boolean) => setMenu({ open: value, path: location.pathname });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu({ open: false, path: location.pathname });
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, location.pathname]);

  return (
    <header
      className={`era-body-transition fixed top-0 inset-x-0 z-50 ${
        scrolled || open
          ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md border-b-[length:var(--border-width)] border-[var(--border-primary)]'
          : 'bg-[var(--bg-primary)]/55 backdrop-blur-[2px]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 sm:h-24 flex items-center justify-between gap-2 sm:gap-6">
        <Link to="/" className="min-w-0 overflow-hidden" aria-label="Suma Paciencia, inicio">
          <BandLogo size="sm" showTagline={false} />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => {
            const active = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm transition-colors ${
                  active
                    ? 'text-[var(--text-primary)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
                {active && (
                  <span aria-hidden className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[var(--accent-primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <EraSwitcher compact />

          <button
            onClick={openCart}
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)] shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:bg-[var(--accent-secondary)] transition-all sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
            aria-label={`Carrito de compras, ${cartCount} productos`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="mono text-[0.68rem] hidden sm:inline">Pedido</span>
            <span className="mono absolute -right-1.5 -top-1.5 min-w-[1.1rem] bg-[var(--accent-primary)] px-1 text-center text-[0.6rem] text-[var(--text-on-accent)] sm:static sm:min-w-[1.35rem] sm:px-1.5 sm:text-[0.68rem]">
              {cartCount}
            </span>
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-[var(--text-primary)] lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden bg-[var(--bg-primary)] border-t-[length:var(--border-width)] border-[var(--border-primary)] transition-[max-height] duration-300 ${
          open
            ? 'max-h-[calc(100dvh-5rem)] sm:max-h-[calc(100dvh-6rem)] overflow-y-auto'
            : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="px-4 sm:px-8 py-4 border-b border-[var(--border-subtle)]">
          <EraSwitcher className="w-full justify-between" />
        </div>
        <nav className="px-4 sm:px-8 py-4 flex flex-col" aria-label="Navegación móvil">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="display text-2xl font-bold text-[var(--text-primary)] py-2.5 border-b border-[var(--border-subtle)]"
          >
            Inicio
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="display text-2xl font-bold text-[var(--text-primary)] py-2.5 border-b border-[var(--border-subtle)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 sm:px-8 pt-1 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={() => {
              setOpen(false);
              openCart();
            }}
            className="inline-flex w-full items-center justify-center gap-2 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-on-surface)] shadow-[var(--card-shadow)] hover:bg-[var(--accent-secondary)] transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="mono text-[0.72rem] uppercase tracking-[0.14em]">Ver pedido ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
