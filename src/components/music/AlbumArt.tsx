import type { ArtStyle } from '@/data/discography';

type Props = {
  style: ArtStyle;
  label: string;
  sub: string;
  className?: string;
  showSpine?: boolean;
};

/**
 * Arte de tapa original dibujado en SVG. Cada estilo tiene su propia paleta
 * y composición; nada de stock ni placeholders genéricos.
 */
export default function AlbumArt({ style, label, sub, className = '', showSpine = false }: Props) {
  const lines = label.split('\n');

  return (
    <div className={`relative overflow-hidden bg-[var(--bg-secondary)] ${className}`}>
      <svg viewBox="0 0 600 600" className="w-full h-full block" role="img" aria-label={`Arte de ${label.replace('\n', ' ')}`}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <pattern id="grooves" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.6" fill="none" stroke="rgba(244,239,230,.10)" strokeWidth="0.7" />
          </pattern>
        </defs>

        {style === 'tqca' && (
          <>
            <rect width="600" height="600" fill="#1A211B" />
            <circle cx="300" cy="330" r="215" fill="#D99B26" />
            <rect x="0" y="330" width="600" height="270" fill="#121310" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M0 ${370 + i * 34} C 150 ${350 + i * 34}, 300 ${395 + i * 34}, 600 ${365 + i * 34}`}
                fill="none"
                stroke="#5C7A4E"
                strokeWidth="3"
                opacity={0.75 - i * 0.08}
              />
            ))}
            <circle cx="300" cy="330" r="215" fill="url(#grooves)" opacity="0.5" />
            {lines.map((line, i) => (
              <text
                key={i}
                x="44"
                y={110 + i * 78}
                fill="#F4EFE6"
                fontFamily="Fraunces Variable, Georgia, serif"
                fontWeight="800"
                fontSize="78"
                letterSpacing="-2"
              >
                {line}
              </text>
            ))}
            <text x="44" y="572" fill="#D99B26" fontFamily="JetBrains Mono Variable, monospace" fontSize="17" letterSpacing="3">
              {sub}
            </text>
          </>
        )}

        {style === 'clasico' && (
          <>
            <rect width="600" height="600" fill="#F4EFE6" />
            <path d="M0 470 L600 470 L600 600 L0 600 Z" fill="#C85A32" />
            <path d="M90 470 L90 210 A210 210 0 0 1 510 210 L510 470 Z" fill="#1A211B" />
            <circle cx="300" cy="250" r="120" fill="#D99B26" />
            <circle cx="300" cy="250" r="120" fill="url(#grooves)" opacity="0.6" />
            {lines.map((line, i) => (
              <text
                key={i}
                x="300"
                y={300 + i * 46}
                textAnchor="middle"
                fill="#F4EFE6"
                fontFamily="Fraunces Variable, Georgia, serif"
                fontWeight="800"
                fontSize="52"
                letterSpacing="-1"
              >
                {line}
              </text>
            ))}
            <text x="300" y="540" textAnchor="middle" fill="#F4EFE6" fontFamily="JetBrains Mono Variable, monospace" fontSize="16" letterSpacing="3">
              {sub}
            </text>
          </>
        )}

        {style === 'romaphonic' && (
          <>
            <rect width="600" height="600" fill="#121310" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((i) => {
              const h = 30 + Math.abs(Math.sin(i * 1.7)) * 210;
              return (
                <rect
                  key={i}
                  x={70 + i * 26}
                  y={300 - h / 2}
                  width="12"
                  height={h}
                  fill={i % 4 === 0 ? '#C85A32' : '#5C7A4E'}
                  opacity={0.85}
                />
              );
            })}
            <text
              x="300"
              y="140"
              textAnchor="middle"
              fill="#F4EFE6"
              fontFamily="Fraunces Variable, Georgia, serif"
              fontWeight="800"
              fontSize="56"
            >
              {label}
            </text>
            <text x="300" y="500" textAnchor="middle" fill="#D99B26" fontFamily="JetBrains Mono Variable, monospace" fontSize="16" letterSpacing="3">
              {sub}
            </text>
          </>
        )}

        {style === 'trigo' && (
          <>
            <rect width="600" height="600" fill="#F4EFE6" />
            <path d="M0 600 L600 0 L600 600 Z" fill="#D99B26" />
            <path d="M0 0 L600 0 L0 600 Z" fill="#1A211B" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <circle key={i} cx={90 + i * 52} cy={520 - i * 24} r="7" fill="#F4EFE6" opacity="0.7" />
            ))}
            {lines.map((line, i) => (
              <text
                key={i}
                x="44"
                y={140 + i * 74}
                fill="#F4EFE6"
                fontFamily="Fraunces Variable, Georgia, serif"
                fontWeight="800"
                fontSize="70"
              >
                {line}
              </text>
            ))}
            <text x="44" y="566" fill="#F4EFE6" fontFamily="JetBrains Mono Variable, monospace" fontSize="16" letterSpacing="3">
              {sub}
            </text>
          </>
        )}

        {style === 'single' && (
          <>
            <rect width="600" height="600" fill="#121310" />
            <rect x="26" y="26" width="548" height="548" fill="none" stroke="#D99B26" strokeWidth="3" />
            <rect x="26" y="26" width="548" height="548" fill="url(#grooves)" />
            {lines.map((line, i) => (
              <text
                key={i}
                x="300"
                y={270 + i * 60}
                textAnchor="middle"
                fill="#F4EFE6"
                fontFamily="Fraunces Variable, Georgia, serif"
                fontWeight="800"
                fontSize="58"
              >
                {line}
              </text>
            ))}
            <text x="300" y="520" textAnchor="middle" fill="#5C7A4E" fontFamily="JetBrains Mono Variable, monospace" fontSize="17" letterSpacing="4">
              {sub}
            </text>
          </>
        )}

        <rect width="600" height="600" filter="url(#grain)" opacity="0.05" />
      </svg>

      {showSpine && (
        <span className="absolute left-0 top-0 bottom-0 w-6 bg-[var(--bg-contrast)]/85 border-r border-[var(--border-primary)]/15 hidden sm:flex items-center justify-center">
          <span className="mono text-[0.55rem] tracking-[0.25em] text-[var(--text-secondary)] uppercase whitespace-nowrap -rotate-90">
            SUMA PACIENCIA
          </span>
        </span>
      )}
    </div>
  );
}
