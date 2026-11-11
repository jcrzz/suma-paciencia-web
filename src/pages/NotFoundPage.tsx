import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="pt-32 pb-24 max-w-[620px] mx-auto px-5 text-center">
      <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Error 404</p>
      <h1 className="display text-[clamp(2.4rem,9vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
        ESTA PISTA
        <br />
        NO EXISTE
      </h1>
      <p className="text-[var(--text-secondary)] mt-5 leading-relaxed">
        La página que buscabas no está acá. Volvé al inicio o mirá las próximas fechas.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="bg-[var(--accent-primary)] text-[var(--text-on-surface)] font-[Fraunces_VF] font-bold px-6 py-3 hover:bg-[var(--accent-secondary)] transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          to="/shows"
          className="border border-[var(--border-primary)] text-[var(--text-primary)] font-[Fraunces_VF] font-bold px-6 py-3 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
        >
          Ver fechas
        </Link>
      </div>
    </div>
  );
}
