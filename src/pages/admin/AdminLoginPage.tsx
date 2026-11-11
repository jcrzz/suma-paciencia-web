import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { env } from '@/lib/config';

export default function AdminLoginPage() {
  const { user, signIn, isDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(isDemo ? env.DEMO_ADMIN_EMAIL : '');
  const [password, setPassword] = useState(isDemo ? env.DEMO_ADMIN_PASSWORD : '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="admin-shell min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-[var(--line-light)]">
        <div>
          <span className="mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--ocre)]">Acceso interno</span>
          <h1 className="display text-5xl font-extrabold leading-[0.9] tracking-[-0.02em] mt-4">
            SUMA
            <br />
            PACIENCIA
          </h1>
        </div>
        <p className="text-[var(--muted)] max-w-[38ch] leading-relaxed">
          Panel de gestión de fechas, galería, EPK, merchandising y pedidos de la tienda oficial.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] space-y-5">
          <div className="lg:hidden">
            <span className="mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--ocre)]">Acceso interno</span>
            <h1 className="display text-3xl font-extrabold text-[var(--paper)] mt-2">Suma Paciencia</h1>
          </div>

          <div>
            <label htmlFor="admin-email" className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)] block mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-[var(--line-light)] px-3 py-2.5 text-[var(--paper)] focus:outline-none focus:border-[var(--ocre)] transition-colors"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)] block mb-1.5">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-[var(--line-light)] px-3 py-2.5 text-[var(--paper)] focus:outline-none focus:border-[var(--ocre)] transition-colors"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="flex items-start gap-2 text-sm text-[var(--terracota)]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--ocre)] text-[var(--ink)] font-[Fraunces_VF] font-bold py-3 hover:bg-[var(--paper)] transition-colors disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" /> {loading ? 'Entrando…' : 'Entrar al panel'}
          </button>

          {isDemo && (
            <p className="mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--muted)] leading-relaxed">
              Modo demo · usuario {env.DEMO_ADMIN_EMAIL} · contraseña {env.DEMO_ADMIN_PASSWORD}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
