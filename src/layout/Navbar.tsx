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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`era-body-transition fixed top-0 inset-x-0 z-50 ${
        scrolled || open
          ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md border-b-[length:var(--border-width)] border-[var(--border-primary)]'
          : 'bg-[var(--bg-primary)]/55 backdrop-blur-[2px]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 sm:h-24 flex items-center justify-between gap-3 sm:gap-6">
        <Link to="/" className="shrink-0" aria-label="Suma Paciencia, inicio">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <EraSwitcher />
          </div>
          <div className="md:hidden">
            <EraSwitcher compact />
          </div>

          <button
            onClick={openCart}
            className="relative inline-flex items-center gap-2 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] px-2.5 sm:px-4 py-2 text-[var(--text-on-surface)] shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:bg-[var(--accent-secondary)] transition-all"
            aria-label={`Carrito de compras, ${cartCount} productos`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="mono text-[0.68rem] hidden sm:inline">Pedido</span>
            <span className="mono text-[0.68rem] bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-1.5 min-w-[1.35rem] text-center">
              {cartCount}
            </span>
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 text-[var(--text-primary)]"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden bg-[var(--bg-primary)] border-t-[length:var(--border-width)] border-[var(--border-primary)] transition-[max-height] duration-300 ${
          open ? 'max-h-[680px]' : 'max-h-0'
        }`}
      >
        <div className="px-4 sm:px-8 py-4 border-b border-[var(--border-subtle)]">
          <EraSwitcher className="w-full justify-between" />
        </div>
        <nav className="px-4 sm:px-8 py-4 flex flex-col" aria-label="Navegación móvil">
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
      </div>
    </header>
  );
}
