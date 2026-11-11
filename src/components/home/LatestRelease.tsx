import { Link } from 'react-router-dom';
import { featuredAlbum } from '@/data/discography';
import AlbumArt from '@/components/music/AlbumArt';
import SumampPlayer from '@/components/music/SumampPlayer';
import { formatPricePlain } from '@/lib/utils';

type Props = {
  productCount: number;
  featuredPrice: number;
};

export function LatestRelease({ productCount, featuredPrice }: Props) {
  return (
    <section id="lanzamiento" className="bg-[var(--bg-surface)] text-[var(--text-on-surface)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="relative">
            <AlbumArt
              style={featuredAlbum.art}
              label={featuredAlbum.artLabel}
              sub={featuredAlbum.artSub}
              className="aspect-square w-full border-[length:var(--border-width)] border-[var(--border-primary)]"
            />
            <div className="absolute -bottom-5 -right-5 hidden sm:block bg-[var(--accent-primary)] px-4 py-3 border-[length:var(--border-width)] border-[var(--border-primary)]">
              <span className="mono text-[0.6rem] uppercase tracking-[0.16em] block">Desde</span>
              <span className="display text-2xl font-bold">{formatPricePlain(featuredPrice)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Último lanzamiento</p>
          <h2 className="display text-4xl sm:text-6xl font-extrabold leading-[0.92] tracking-[-0.02em] mt-3">
            {featuredAlbum.title}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-[60ch] mt-5">
            {featuredAlbum.note}
          </p>

          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-y border-[var(--border-subtle)] py-5">
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Sello</dt>
              <dd className="font-[Fraunces_VF] font-bold">{featuredAlbum.label}</dd>
            </div>
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Año</dt>
              <dd className="font-[Fraunces_VF] font-bold">{featuredAlbum.year}</dd>
            </div>
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Canciones</dt>
              <dd className="font-[Fraunces_VF] font-bold">{featuredAlbum.tracks.length}</dd>
            </div>
            <div>
              <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Duración</dt>
              <dd className="font-[Fraunces_VF] font-bold">{featuredAlbum.duration}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <SumampPlayer album={featuredAlbum} compact />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={featuredAlbum.spotify ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] font-[Fraunces_VF] font-bold px-6 py-3 border-[length:var(--border-width)] border-[var(--border-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
            >
              Escuchar en Spotify
            </a>
            <Link
              to="/musica"
              className="border-[length:var(--border-width)] border-[var(--border-primary)] px-6 py-3 font-[Fraunces_VF] font-bold hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
            >
              Ver discografía
            </Link>
            <span className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-secondary)] self-center">
              {productCount} productos en la tienda
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestRelease;
