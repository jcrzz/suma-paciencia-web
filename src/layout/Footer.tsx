import { Link } from 'react-router-dom';
import { MessageCircle, Mail } from 'lucide-react';
import { env } from '@/lib/config';
import { buildContactLink } from '@/lib/whatsapp';
import { useEra } from '@/context/EraContext';
import BandLogo from '@/components/ui/BandLogo';
import EraSwitcher from '@/components/layout/EraSwitcher';
import SectionDivider from '@/components/ui/SectionDivider';

const NAV = [
  { label: 'Fechas', href: '/shows' },
  { label: 'Música', href: '/musica' },
  { label: 'Galería', href: '/galeria' },
  { label: 'EPK', href: '/epk' },
  { label: 'Tienda', href: '/tienda' },
];

const SOCIALS = [
  {
    href: 'https://www.instagram.com/sumapaciencia/',
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 5.1a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm0 7.7a3 3 0 110-6 3 3 0 010 6zm5.9-7.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z',
  },
  {
    href: 'https://www.youtube.com/@sumapaciencia',
    label: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3L10 15z',
  },
  {
    href: 'https://es-la.facebook.com/sumapaciencia.reggae/',
    label: 'Facebook',
    path: 'M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.2H7.6V14h2.7v8h3.2z',
  },
];

export default function Footer() {
  const { activeEra } = useEra();
  const isNewEra = activeEra === 'todo-queda-aca';

  return (
    <footer className="era-body-transition relative overflow-hidden bg-[var(--bg-contrast)] text-[var(--text-on-contrast)]">
      {!isNewEra && <div aria-hidden className="era-halftone absolute inset-0 opacity-30" />}
      <SectionDivider tone="contrast" className="relative pt-10" />
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 min-w-0">
            <p className="mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--accent-primary)]">Sitio oficial</p>
            <div className="mt-4 @container max-w-full">
              <BandLogo size="lg" tone="contrast" showTagline={false} fitContainer />
            </div>
            <p className="text-[var(--text-on-contrast)]/80 mt-4 max-w-[42ch] leading-relaxed text-sm">
              Reggae roots del litoral argentino. Banda de Concepción del Uruguay, Entre Ríos, desde 2009.
            </p>
            <div className="mt-5">
              <EraSwitcher />
            </div>
          </div>

          <nav className="lg:col-span-3 min-w-0" aria-label="Navegación del pie">
            <p className="mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-4">Secciones</p>
            <ul className="space-y-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[var(--text-on-contrast)] hover:text-[var(--accent-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin/login" className="text-[var(--text-on-contrast)]/65 hover:text-[var(--text-on-contrast)] transition-colors">
                  Acceso del equipo
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-4 min-w-0">
            <p className="mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-4">Contacto</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${env.CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-[var(--text-on-contrast)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Mail className="h-4 w-4 text-[var(--accent-primary)]" /> {env.CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={buildContactLink('Hola Suma Paciencia, los escribo por la web.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--text-on-contrast)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-[var(--accent-primary)]" /> WhatsApp {env.WHATSAPP_NUMBER}
                </a>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ href, label, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 border border-[var(--border-on-contrast)] text-[var(--text-on-contrast)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border-on-contrast)] flex flex-wrap items-center justify-between gap-3">
          <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--text-on-contrast)]/65">
            © {new Date().getFullYear()} Suma Paciencia
          </p>
          <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--text-on-contrast)]/65">
            Hecho en Concepción del Uruguay
          </p>
        </div>
      </div>
    </footer>
  );
}
