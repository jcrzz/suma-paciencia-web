import { Link } from 'react-router-dom';
import { albums } from '@/data/discography';
import { useEra } from '@/context/EraContext';
import BandLogo from '@/components/ui/BandLogo';
import HeroArtwork from '@/components/home/HeroArtwork';

export function Hero() {
  const { activeEra, eraMeta } = useEra();
  const album = albums.find((item) => item.id === eraMeta.albumId) ?? albums[0];
  const isNewEra = activeEra === 'todo-queda-aca';
  const accent = isNewEra ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-primary)]';
  const bodyCopy = isNewEra
    ? 'Nueve canciones que cruzan denuncia social, amor y celebración. El reggae sigue siendo la raíz, pero el sonido se expande con guitarras, vientos, sintetizadores y acentos latinos.'
    : 'El primer álbum homónimo: reggae litoraleño de raíz, serigrafía urbana y siete canciones fundacionales grabadas en Salas Gallo. La edición que abrió el camino.';

  return (
    <section className="era-body-transition relative overflow-hidden bg-[var(--bg-primary)] border-b-[length:var(--border-width)] border-[var(--border-primary)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={
          isNewEra
            ? {
                backgroundImage:
                  'radial-gradient(circle at 16% 18%, rgba(198,216,200,.9) 0, transparent 34%), radial-gradient(circle at 88% 72%, rgba(242,198,206,.5) 0, transparent 32%), radial-gradient(circle at 62% 8%, rgba(221,160,75,.18) 0, transparent 28%)',
              }
            : {
                backgroundImage:
                  'radial-gradient(#141817 1.1px, transparent 1.1px), radial-gradient(circle at 82% 12%, rgba(221,164,59,.35) 0, transparent 30%)',
                backgroundSize: '7px 7px, auto',
              }
        }
      />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-14 sm:pt-36 sm:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-10 items-center">
        <div className="lg:col-span-6 xl:col-span-5">
          <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">
            {isNewEra ? `Disco nuevo · ${eraMeta.year}` : `Edición fundacional · ${eraMeta.year}`}
          </p>

          <div className="mt-4">
            <BandLogo size={isNewEra ? 'lg' : 'md'} tone="default" />
          </div>

          <h1
            className={`era-heading mt-5 text-[clamp(2.1rem,6vw,4.4rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] ${
              isNewEra ? '' : 'era-stencil-type'
            }`}
          >
            {isNewEra ? (
              <>
                TODO
                <br />
                QUEDA
                <br />
                <span className={accent}>ACÁ.</span>
              </>
            ) : (
              <>
                HOMÓNIMO
                <br />
                <span className={accent}>2016.</span>
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[48ch]">
            <span className="block font-bold text-[var(--text-primary)]">{eraMeta.heroSubtitle}</span>
            <span className="mt-2 block">{bodyCopy}</span>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#lanzamiento"
              className="era-body-transition inline-flex items-center gap-2 bg-[var(--accent-primary)] px-6 py-3 font-[Fraunces_VF] font-bold text-[var(--text-on-accent)] border-[length:var(--border-width)] border-[var(--border-primary)] shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:bg-[var(--bg-surface-alt)]"
            >
              {isNewEra ? 'Escuchar el disco' : 'Escuchar el homónimo'}
            </a>
            <Link
              to="/shows"
              className="era-body-transition inline-flex items-center gap-2 border-[length:var(--border-width)] border-[var(--border-primary)] px-6 py-3 font-[Fraunces_VF] font-bold text-[var(--text-primary)] hover:-translate-y-0.5 hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)]"
            >
              Próximas fechas
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 max-w-lg border-t-[length:var(--border-width)] border-[var(--border-subtle)] pt-5">
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Año</dt>
              <dd className="display text-2xl font-bold text-[var(--text-primary)]">{eraMeta.year}</dd>
            </div>
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Canciones</dt>
              <dd className="display text-2xl font-bold text-[var(--text-primary)]">
                {String(album.tracks.length).padStart(2, '0')}
              </dd>
            </div>
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Duración</dt>
              <dd className="display text-2xl font-bold text-[var(--text-primary)]">{album.duration}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 xl:col-span-7 relative">
          <div className={`mx-auto max-w-[620px] ${isNewEra ? 'era-illustration' : 'border-[3px] border-[var(--border-primary)] shadow-[8px_8px_0_#141817]'}`}>
            <HeroArtwork />
          </div>
          <p className="mono mt-4 text-center text-[0.58rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            {eraMeta.heroCredit}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
