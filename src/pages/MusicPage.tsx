import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import AlbumArt from '@/components/music/AlbumArt';
import Modal from '@/components/ui/Modal';
import SumampPlayer from '@/components/music/SumampPlayer';
import { albums, singles, type Album } from '@/data/discography';

export default function MusicPage() {
  const [lyricsTrack, setLyricsTrack] = useState<{ album: Album; title: string; text: string } | null>(null);

  return (
    <div className="pt-24 sm:pt-28">
      <header className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-10 border-b border-[var(--border-subtle)]">
        <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Discografía</p>
        <h1 className="display text-[clamp(2.4rem,8vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
          MÚSICA
        </h1>
        <p className="text-[var(--text-secondary)] max-w-[62ch] mt-4 leading-relaxed">
          Tres discos, un EP grabado en vivo y una lista de sencillos que fue marcando el camino desde 2009. En 2026, “Todo queda acá” amplía el sonido de la banda con nueve canciones nuevas.
          Las letras cargadas son las publicadas por la banda en sus canales oficiales.
        </p>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 space-y-20">
        {albums.map((album) => (
          <ReleaseBlock
            key={album.id}
            album={album}
            onOpenLyrics={(title, text) => setLyricsTrack({ album, title, text })}
          />
        ))}

        <section>
          <header className="flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 mb-8">
            <h2 className="display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Sencillos</h2>
            <span className="mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              {singles.length} lanzamientos
            </span>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {singles.map((single) => (
              <article key={single.id} className="group">
                <AlbumArt
                  style={single.art}
                  label={single.artLabel}
                  sub={single.artSub}
                  className="aspect-square w-full border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors"
                />
                <h3 className="display font-bold text-[var(--text-primary)] mt-3 text-base leading-tight">{single.title}</h3>
                <p className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)] mt-1">
                  {single.year} · {single.duration}
                </p>
                <div className="flex gap-3 mt-2">
                  {single.spotify && (
                    <a
                      href={single.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                    >
                      Spotify <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {single.youtube && (
                    <a
                      href={single.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                    >
                      YouTube <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Modal
        open={Boolean(lyricsTrack)}
        onClose={() => setLyricsTrack(null)}
        title={lyricsTrack ? `${lyricsTrack.title} — ${lyricsTrack.album.title}` : ''}
        size="lg"
      >
        {lyricsTrack && (
          <div>
            <p className="mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-secondary)] mb-5">
              Letra publicada por la banda
            </p>
            <pre className="font-[Fraunces_VF] text-[0.98rem] leading-[1.75] whitespace-pre-wrap font-normal text-[var(--text-on-surface)]">
              {lyricsTrack.text}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ReleaseBlock({
  album,
  onOpenLyrics,
}: {
  album: Album;
  onOpenLyrics: (title: string, text: string) => void;
}) {
  return (
    <article className="grid lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4">
        <AlbumArt
          style={album.art}
          label={album.artLabel}
          sub={album.artSub}
          showSpine
          className="aspect-square w-full border border-[var(--border-subtle)]"
        />
      </div>

      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-[-0.02em]">
            {album.title}
          </h2>
          <span className="mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent-primary)]">
            {album.kind === 'album' ? 'Álbum' : album.kind === 'ep' ? 'EP' : 'Sencillo'} · {album.year}
          </span>
        </div>

        {album.note && <p className="text-[var(--text-secondary)] leading-relaxed max-w-[64ch] mt-4">{album.note}</p>}

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[var(--border-subtle)] py-4 mt-6">
          <div>
            <dt className="mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Sello</dt>
            <dd className="font-[Fraunces_VF] font-bold text-[var(--text-primary)] text-sm mt-0.5">{album.label}</dd>
          </div>
          <div>
            <dt className="mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Duración</dt>
            <dd className="font-[Fraunces_VF] font-bold text-[var(--text-primary)] text-sm mt-0.5">{album.duration}</dd>
          </div>
          <div>
            <dt className="mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Tracks</dt>
            <dd className="font-[Fraunces_VF] font-bold text-[var(--text-primary)] text-sm mt-0.5">{album.tracks.length || '—'}</dd>
          </div>
          <div className="flex items-end gap-4">
            {album.spotify && (
              <a
                href={album.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
              >
                Spotify <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {album.youtube && (
              <a
                href={album.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
              >
                YouTube <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </dl>

        {album.tracks.length > 0 ? (
          <div className="mt-6">
            <SumampPlayer
              album={album}
              onOpenLyrics={(track) => track.lyrics && onOpenLyrics(track.title, track.lyrics)}
            />
          </div>
        ) : (
          <p className="mt-6 text-sm text-[var(--text-secondary)]">
            El tracklist completo está disponible en Spotify y YouTube.
          </p>
        )}
      </div>
    </article>
  );
}
