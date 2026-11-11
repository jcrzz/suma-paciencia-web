import { useEffect, useState } from 'react';
import { Download, ExternalLink, Mail, MessageCircle, Phone } from 'lucide-react';
import { getEpkInfo } from '@/lib/repositories/epk';
import { buildContactLink } from '@/lib/whatsapp';
import { env } from '@/lib/config';
import { pressFeatures } from '@/data/press';
import type { EpkInfo } from '@/types';

export default function EpkPage() {
  const [epk, setEpk] = useState<EpkInfo | null>(null);

  useEffect(() => {
    getEpkInfo().then(setEpk).catch(() => setEpk(null));
  }, []);

  if (!epk) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="display text-xl font-bold text-[var(--text-primary)]">Cargando el EPK…</p>
      </div>
    );
  }

  const whatsappMessage = 'Hola Suma Paciencia, los contacto por el EPK / booking.';

  return (
    <div className="pt-24 sm:pt-28">
      <header className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8 border-b border-[var(--border-subtle)]">
        <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Electronic Press Kit</p>
        <h1 className="display text-[clamp(2.4rem,8vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
          EPK
        </h1>
        <p className="text-[var(--text-secondary)] max-w-[62ch] mt-4 leading-relaxed">
          Todo lo que necesitás para escribir una nota, una entrevista o una fecha: biografía, conformación,
          material gráfico y rider técnico.
        </p>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="display text-2xl font-bold text-[var(--text-primary)]">Biografía</h2>
            <div className="mt-4 space-y-4 text-[var(--text-secondary)] leading-[1.75] max-w-[68ch]">
              {epk.bio.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="display text-2xl font-bold text-[var(--text-primary)]">Todo queda acá</h2>
            <div className="mt-4 space-y-4 text-[var(--text-secondary)] leading-[1.75] max-w-[68ch]">
              <p>
                El nuevo disco de Suma Paciencia amplía el universo sonoro de la banda: la raíz reggae se
                cruza con soul, electrónica, vientos y guitarras, sin perder el pulso bailable ni la mirada
                social que caracteriza al grupo.
              </p>
              <p>
                “No me representan” concentra la incomodidad y la crítica, mientras que “Cosas Buenas”,
                “Claro que te extraño” y “Casual” abren la puerta al amor, los vínculos y la celebración.
                Néstor Ramljak (Nonpalidece) y Ras Kuko aportan sus voces en dos de los momentos más altos
                del álbum.
              </p>
            </div>
          </section>

          <section>
            <h2 className="display text-2xl font-bold text-[var(--text-primary)]">Conformación</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 border-t border-[var(--border-subtle)]">
              {epk.members.map((member) => (
                <li
                  key={member.name}
                  className="flex items-baseline justify-between gap-4 py-2.5 border-b border-[var(--border-subtle)]"
                >
                  <span className="font-[Fraunces_VF] font-bold text-[var(--text-primary)]">{member.name}</span>
                  <span className="mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                    {member.instrument}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="display text-2xl font-bold text-[var(--text-primary)]">En prensa</h2>
            <div className="mt-4 space-y-4">
              {pressFeatures.map((feature) => (
                <a
                  key={feature.id}
                  href={feature.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)] p-4 hover:-translate-y-0.5 hover:shadow-[var(--card-shadow)] transition-all"
                >
                  <div className="flex flex-wrap items-center gap-2 mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">
                    <span className="bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-2 py-0.5">{feature.tag}</span>
                    <span>{feature.source}</span>
                    <span>· {feature.year}</span>
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  </div>
                  <p className="mt-2 display text-lg font-bold leading-tight group-hover:text-[var(--accent-primary)] transition-colors">
                    {feature.title}
                  </p>
                  <p className="mt-1.5 text-sm text-[var(--text-on-surface-secondary)] leading-relaxed">{feature.excerpt}</p>
                </a>
              ))}
            </div>
          </section>

          {epk.press_quotes.length > 0 && (
            <section>
              <h2 className="display text-2xl font-bold text-[var(--text-primary)]">Citas de prensa</h2>
              <ul className="mt-4 space-y-4">
                {epk.press_quotes.map((quote) => (
                  <li key={quote.source} className="border-l-2 border-[var(--accent-primary)] pl-4">
                    <p className="text-[var(--text-primary)] leading-relaxed">“{quote.quote}”</p>
                    <p className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)] mt-1.5">
                      {quote.source}
                      {quote.link && (
                        <a
                          href={quote.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-[var(--accent-primary)] inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
                        >
                          ver nota <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <h2 className="display text-lg font-bold text-[var(--text-primary)] px-5 py-3 border-b border-[var(--border-subtle)]">
              Ficha técnica
            </h2>
            <dl className="divide-y divide-[var(--border-subtle)]">
              <Row label="Origen" value="Concepción del Uruguay, Entre Ríos" />
              <Row label="Formación" value="2009" />
              <Row label="Género" value="Reggae roots, soul, fusion" />
              <Row label="Discos" value="3 (+ 1 EP en vivo)" />
              <Row label="Último release" value="Todo queda acá (2026)" />
              <Row label="Sello" value="Impronta Music" />
            </dl>
          </div>

          {epk.press_photo_url && (
            <figure className="border border-[var(--border-subtle)]">
              <img src={epk.press_photo_url} alt="Foto de prensa de Suma Paciencia" className="w-full h-auto" />
              <figcaption className="mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--text-secondary)] px-4 py-3 border-t border-[var(--border-subtle)]">
                Foto de prensa · descarga libre para publicar
              </figcaption>
            </figure>
          )}

          <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 space-y-3">
            <h2 className="display text-lg font-bold text-[var(--text-primary)]">Descargas</h2>
            {epk.rider_url && (
              <a
                href={epk.rider_url}
                download
                className="flex items-center justify-between gap-3 border border-[var(--border-subtle)] px-4 py-3 hover:border-[var(--accent-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--text-primary)]">Rider técnico (PDF)</span>
                <Download className="h-4 w-4 text-[var(--accent-primary)]" />
              </a>
            )}
            {epk.press_kit_url && (
              <a
                href={epk.press_kit_url}
                download
                className="flex items-center justify-between gap-3 border border-[var(--border-subtle)] px-4 py-3 hover:border-[var(--accent-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--text-primary)]">Press kit (PDF)</span>
                <Download className="h-4 w-4 text-[var(--accent-primary)]" />
              </a>
            )}
          </div>

          <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 space-y-3">
            <h2 className="display text-lg font-bold text-[var(--text-primary)]">Contacto</h2>
            {epk.booking_email && (
              <a
                href={`mailto:${epk.booking_email}`}
                className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Mail className="h-4 w-4 text-[var(--accent-primary)]" /> {epk.booking_email}
              </a>
            )}
            {epk.press_email && (
              <a
                href={`mailto:${epk.press_email}`}
                className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Mail className="h-4 w-4 text-[var(--accent-primary)]" /> {epk.press_email}
              </a>
            )}
            {epk.booking_phone && (
              <a
                href={`tel:${epk.booking_phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Phone className="h-4 w-4 text-[var(--accent-primary)]" /> {epk.booking_phone}
              </a>
            )}
            <a
              href={buildContactLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[var(--accent-primary)]" /> WhatsApp {env.WHATSAPP_NUMBER}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3">
      <dt className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">{label}</dt>
      <dd className="text-sm text-[var(--text-primary)] text-right">{value}</dd>
    </div>
  );
}
