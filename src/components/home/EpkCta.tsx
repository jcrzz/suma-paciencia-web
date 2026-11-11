import { Link } from 'react-router-dom';
import { Download, Newspaper } from 'lucide-react';
import { useEra } from '@/context/EraContext';
import type { EpkInfo } from '@/types';

export function EpkCta({ epk }: { epk: EpkInfo }) {
  const { activeEra } = useEra();
  const isNewEra = activeEra === 'todo-queda-aca';

  return (
    <section className="era-body-transition relative overflow-hidden bg-[var(--bg-contrast)] text-[var(--text-on-contrast)]">
      {!isNewEra && <div aria-hidden className="era-halftone absolute inset-0 opacity-30" />}
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Prensa y booking</p>
          <h2 className="era-heading text-3xl sm:text-5xl font-extrabold leading-[0.95] tracking-[-0.02em] mt-3">
            EPK, rider técnico y material de prensa
          </h2>
          <p className="text-[var(--text-on-contrast)]/80 leading-relaxed max-w-[58ch] mt-4">
            Biografía oficial, conformación, fotos en alta resolución y el rider técnico listo para descargar.
            Escribinos para prensa, sincronización o booking.
          </p>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/epk"
              className="era-body-transition inline-flex items-center gap-2 bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-[Fraunces_VF] font-bold px-6 py-3 border-[length:var(--border-width)] border-[var(--border-primary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-on-surface)]"
            >
              <Newspaper className="h-4 w-4" /> Ver el EPK
            </Link>
            {epk.rider_url && (
              <a
                href={epk.rider_url}
                download
                className="era-body-transition inline-flex items-center gap-2 border-[length:var(--border-width)] border-[var(--border-on-contrast)] px-6 py-3 font-[Fraunces_VF] font-bold text-[var(--text-on-contrast)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] hover:border-[var(--accent-primary)]"
              >
                <Download className="h-4 w-4" /> Rider técnico (PDF)
              </a>
            )}
          </div>
          <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-on-contrast)]/70">
            {epk.booking_email ? `Booking: ${epk.booking_email}` : 'Consultá por booking'}
            {epk.press_email ? ` · Prensa: ${epk.press_email}` : ''}
          </p>
        </div>
      </div>
    </section>
  );
}

export default EpkCta;
