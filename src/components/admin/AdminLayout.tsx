import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Images,
  FileText,
  ShoppingBag,
  Receipt,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/config';

const NAV = [
  { to: '/admin', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/admin/shows', label: 'Fechas', icon: CalendarDays },
  { to: '/admin/galeria', label: 'Galería', icon: Images },
  { to: '/admin/epk', label: 'EPK y contacto', icon: FileText },
  { to: '/admin/tienda', label: 'Tienda', icon: ShoppingBag },
  { to: '/admin/pedidos', label: 'Pedidos', icon: Receipt },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col lg:flex-row">
      <header className="lg:hidden sticky top-0 z-50 bg-[var(--ink)] border-b border-[var(--line-light)] px-4 py-3 flex items-center justify-between">
        <span className="display font-bold">
          SP <span className="mono text-[0.68rem] tracking-[0.2em] text-[var(--muted)]">ADMIN</span>
        </span>
        <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menú del panel" className="p-1.5">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        className={`${
          menuOpen ? 'block' : 'hidden'
        } lg:block lg:w-[260px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--line-light)] bg-[var(--monte)]/60`}
      >
        <div className="hidden lg:block px-5 py-5 border-b border-[var(--line-light)]">
          <Link to="/admin" className="block">
            <span className="display text-xl font-bold block">Suma Paciencia</span>
            <span className="mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">Panel de administración</span>
          </Link>
        </div>

        <nav className="p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--ocre)] text-[var(--ink)] font-[Fraunces_VF] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--ink)]'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 mt-2 border-t border-[var(--line-light)] pt-3 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Ver el sitio
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--terracota)] transition-colors"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
          {user?.email && (
            <p className="mono text-[0.6rem] text-[var(--muted)] px-3 pt-1 truncate">{user.email}</p>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-5 sm:px-8 py-8 sm:py-10">
        {!isSupabaseConfigured && (
          <p className="mb-6 border border-[var(--ocre)]/60 bg-[var(--ocre)]/10 px-4 py-2.5 mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--ocre)]">
            Modo demo · los cambios se guardan en este navegador. Configurá Supabase para trabajar con datos reales.
          </p>
        )}
        <Outlet />
      </main>
    </div>
  );
}
