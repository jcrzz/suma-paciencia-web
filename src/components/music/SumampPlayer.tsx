import { useMemo, useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { FelixSnailIcon } from '@/components/ui/EraIcons';
import type { Album, Track } from '@/data/discography';

type Props = {
  album: Album;
  compact?: boolean;
  onOpenLyrics?: (track: Track) => void;
};

export default function SumampPlayer({ album, compact = false, onOpenLyrics }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const track = album.tracks[selectedIndex] ?? album.tracks[0];

  const totalDuration = useMemo(() => {
    const seconds = album.tracks.reduce((sum, item) => {
      const [minutes, rest] = item.duration.split(':').map(Number);
      return sum + minutes * 60 + rest;
    }, 0);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [album.tracks]);

  if (!track) return null;

  const selectOffset = (offset: number) => {
    setSelectedIndex((current) => (current + offset + album.tracks.length) % album.tracks.length);
  };

  return (
    <section className={`relative era-card-secondary era-halftone overflow-visible ${compact ? 'p-3 sm:p-4' : 'p-3 sm:p-5'}`}>
      <div className="relative z-10 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)]">
        <header className="flex flex-wrap items-center gap-2 border-b-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)]">
          <div className="flex items-center gap-1" aria-label="Controles de reproducción retro">
            <button
              type="button"
              onClick={() => selectOffset(-1)}
              className="mono border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-0.5 text-[0.62rem] font-bold text-[var(--text-on-surface)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Pista anterior"
            >
              |&lt;&lt;
            </button>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="mono border border-[var(--border-primary)] bg-[var(--accent-primary)] px-2.5 py-0.5 text-[0.62rem] font-bold text-[var(--text-on-accent)]"
              aria-label={playing ? 'Pausar' : 'Reproducir'}
              aria-pressed={playing}
            >
              {playing ? '||' : '>'}
            </button>
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="mono border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-0.5 text-[0.62rem] font-bold text-[var(--text-on-surface)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Detener"
            >
              []
            </button>
            <button
              type="button"
              onClick={() => selectOffset(1)}
              className="mono border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-0.5 text-[0.62rem] font-bold text-[var(--text-on-surface)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Pista siguiente"
            >
              &gt;&gt;|
            </button>
          </div>

          <span className="mono ml-auto border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-0.5 text-[0.62rem] tracking-[0.12em] text-[var(--text-on-surface)]">
            {track.duration}
          </span>
          <span className="mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
            SUMAMP
          </span>
        </header>

        <div className={`grid gap-4 p-3 sm:p-4 ${compact ? '' : 'lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.65fr)]'}`}>
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="mono text-[0.56rem] uppercase tracking-[0.16em] text-[var(--text-on-surface-secondary)]">
                {album.title} · {album.year}
              </p>
              <p className="mono text-[0.56rem] uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)]">
                {String(album.tracks.length).padStart(2, '0')} tracks · {totalDuration}
              </p>
            </div>

            <ol className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {album.tracks.map((item, index) => {
                const active = index === selectedIndex;
                return (
                  <li key={item.number}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIndex(index);
                        setPlaying(true);
                      }}
                      className={`flex w-full items-center gap-3 px-2 py-2 text-left transition-colors ${
                        active
                          ? 'bg-[var(--accent-secondary)] text-[var(--text-primary)]'
                          : 'text-[var(--text-on-surface)] hover:bg-[var(--bg-secondary)]'
                      }`}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="mono w-6 text-[0.62rem] text-[var(--text-on-surface-secondary)]">
                        {String(item.number).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-sm font-semibold uppercase leading-tight">{item.title}</span>
                      <span className="mono text-[0.6rem] text-[var(--text-on-surface-secondary)]">{item.duration}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {!compact && (
            <aside className="border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
              <p className="mono text-[0.56rem] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Reproduciendo ahora
              </p>
              <p className="mt-2 display text-xl font-extrabold leading-tight text-[var(--text-primary)]">
                {track.number}. {track.title}
              </p>
              <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                {track.duration} · {album.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {track.lyrics
                  ? 'Letra publicada por la banda. Abrí la ficha para leerla completa.'
                  : 'Ficha del tema y enlaces oficiales de escucha. La letra se publicará próximamente.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {track.lyrics && onOpenLyrics ? (
                  <button
                    type="button"
                    onClick={() => onOpenLyrics(track)}
                    className="mono inline-flex items-center gap-1.5 border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.1em] text-[var(--text-on-surface)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)]"
                  >
                    <FileText className="h-3.5 w-3.5" /> Ver letra
                  </button>
                ) : null}
                {album.spotify && (
                  <a
                    href={album.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono inline-flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.1em] text-[var(--text-primary)] underline decoration-[var(--border-primary)] underline-offset-4 hover:text-[var(--accent-primary)]"
                  >
                    Escuchar <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-8 -right-3 z-20 hidden sm:block">
        <FelixSnailIcon className="h-16 w-20 drop-shadow-[3px_4px_0_rgba(19,104,71,0.16)]" />
      </div>
    </section>
  );
}
