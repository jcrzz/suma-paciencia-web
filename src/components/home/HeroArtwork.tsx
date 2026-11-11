import { useEra } from '@/context/EraContext';

function KitchenScene() {
  return (
    <svg viewBox="0 0 640 520" className="block h-auto w-full" role="img" aria-label="Ilustración de una cocina luminosa con la heladera, una planta potus y el caracol Félix">
      <defs>
        <filter id="kitchen-pencil">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="kitchen-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width="640" height="520" fill="#C6D8C8" />
      <rect x="10" y="10" width="620" height="500" fill="none" stroke="#136847" strokeWidth="2" />

      <g filter="url(#kitchen-pencil)">
        <rect x="38" y="42" width="244" height="132" rx="3" fill="#DDE9DD" stroke="#136847" strokeWidth="2" />
        <path d="M38 78h244M158 42v132" fill="none" stroke="#136847" strokeWidth="1.6" opacity="0.8" />
        <path d="M98 64v14M208 64v14M98 104v18M208 104v18" stroke="#136847" strokeWidth="2.4" strokeLinecap="round" />

        <rect x="330" y="44" width="182" height="128" rx="3" fill="#F6EFE2" stroke="#136847" strokeWidth="2" />
        <path d="M330 86h182M382 44v128M462 44v128" fill="none" stroke="#136847" strokeWidth="1.4" opacity="0.65" />
        <circle cx="374" cy="65" r="7" fill="#F2C6CE" stroke="#136847" strokeWidth="1.5" />
        <circle cx="452" cy="65" r="7" fill="#DDA04B" stroke="#136847" strokeWidth="1.5" />

        <rect x="56" y="210" width="164" height="254" rx="10" fill="#FAF6EE" stroke="#136847" strokeWidth="2.2" />
        <path d="M56 292h164" fill="none" stroke="#136847" strokeWidth="2" />
        <path d="M196 256v54" fill="none" stroke="#136847" strokeWidth="4" strokeLinecap="round" />
        <rect x="86" y="236" width="30" height="30" rx="4" fill="#DDA04B" stroke="#136847" strokeWidth="1.5" />
        <text x="101" y="259" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="24" fontWeight="800" fill="#136847">S</text>
        <rect x="130" y="236" width="30" height="30" rx="4" fill="#C6D8C8" stroke="#136847" strokeWidth="1.5" />
        <text x="145" y="259" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="24" fontWeight="800" fill="#136847">P</text>
        <g stroke="#136847" strokeWidth="1.5" fill="#F2C6CE">
          <circle cx="101" cy="348" r="9" />
          <circle cx="121" cy="354" r="9" />
          <path d="M110 340c6-16 19-21 30-18" fill="none" strokeLinecap="round" />
        </g>
        <path d="M176 340c8-2 14 2 16 9" fill="none" stroke="#136847" strokeWidth="1.6" strokeLinecap="round" />

        <rect x="390" y="64" width="76" height="76" rx="38" fill="#FAF6EE" stroke="#136847" strokeWidth="2.2" />
        <circle cx="428" cy="102" r="28" fill="none" stroke="#136847" strokeWidth="1" opacity="0.5" />
        <path d="M428 102V84M428 102l14 9" fill="none" stroke="#136847" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="428" cy="102" r="3" fill="#DDA04B" />

        <path d="M356 278h118l-14 104H370Z" fill="#DDA04B" stroke="#136847" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M356 278h118" fill="none" stroke="#136847" strokeWidth="2.4" />
        <path d="M386 282c-6-38-16-58-36-76M408 280c8-44 23-66 48-82M402 282c1-34 8-60 20-82" fill="none" stroke="#136847" strokeWidth="2.4" strokeLinecap="round" />
        <g fill="#C6D8C8" stroke="#136847" strokeWidth="1.8">
          <path d="M350 206c-14-15-12-34 2-45 10 14 10 31-2 45Z" />
          <path d="M456 198c18-10 34-3 40 12-17 7-31 2-40-12Z" />
          <path d="M422 190c-3-20 6-34 22-40 3 19-5 33-22 40Z" />
          <path d="M348 260c-17-5-25-18-21-33 17 3 25 15 21 33Z" />
          <path d="M458 258c17-7 30-2 36 11-15 8-28 4-36-11Z" />
        </g>
        <path d="M386 304c-18 16-27 37-26 62M414 304c12 19 17 40 14 62" fill="none" stroke="#136847" strokeWidth="1.8" strokeLinecap="round" />

        <g transform="translate(330 244) scale(0.9)">
          <path d="M5 36c2.8-4.2 8.2-6.6 14.3-6.6h16.8c3.8 0 6.8 2.2 6.8 5.2 0 2.5-2.2 4.4-5.5 4.4H17.8c-3.6 0-6.7.7-9.2 2.2-.8.5-1.8.1-2.2-.8-.3-.9 0-1.8.6-2.4Z" fill="#F2C6CE" stroke="#136847" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="29" cy="24" r="14" fill="#F2C6CE" stroke="#136847" strokeWidth="1.8" />
          <path d="M29 14c6.3 0 11 4.2 11 9.6 0 5.6-4.8 9.8-10.8 9.8-4.9 0-8.8-2.8-8.8-6.8 0-3.8 3.2-6.4 7.4-6.4 3.3 0 5.8 1.8 5.8 4.4 0 2.2-1.9 3.8-4.3 3.8-1.8 0-3.2-1-3.2-2.4 0-1.3 1.1-2.2 2.5-2.2" fill="none" stroke="#136847" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17 38c-2.8-2.3-4.6-5.2-5.2-8.8" fill="none" stroke="#136847" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="11.4" cy="27.5" r="1.7" fill="#136847" />
          <circle cx="16.2" cy="23.3" r="1.2" fill="#136847" />
        </g>

        <path d="M24 440h592" stroke="#136847" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="258" y="406" width="120" height="34" rx="3" fill="#FAF6EE" stroke="#136847" strokeWidth="2" />
        <path d="M378 414h20c12 0 12 18 0 18h-20" fill="none" stroke="#136847" strokeWidth="2" />
        <path d="M286 398c4-7 4-12 0-18M304 398c4-7 4-12 0-18" fill="none" stroke="#136847" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
        <g fill="#F2C6CE" stroke="#136847" strokeWidth="1.5">
          <circle cx="510" cy="414" r="10" />
          <circle cx="532" cy="420" r="10" />
          <path d="M518 406c8-17 21-24 34-22" fill="none" strokeLinecap="round" />
        </g>
        <rect x="472" y="432" width="106" height="8" rx="2" fill="#FAF6EE" stroke="#136847" strokeWidth="1.6" />
      </g>

      <rect width="640" height="520" filter="url(#kitchen-paper)" opacity="0.06" />
    </svg>
  );
}

function SerigraphyScene() {
  return (
    <svg viewBox="0 0 640 520" className="block h-auto w-full" role="img" aria-label="Lámina serigráfica con sol, palmera, edificio de ladrillo y cables eléctricos">
      <defs>
        <pattern id="serigrafia-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.35" fill="#141817" />
        </pattern>
        <clipPath id="serigrafia-sun-clip">
          <circle cx="424" cy="196" r="142" />
        </clipPath>
      </defs>

      <rect width="640" height="520" fill="#4E9794" />
      <rect x="10" y="10" width="620" height="500" fill="none" stroke="#141817" strokeWidth="3" />

      <circle cx="424" cy="196" r="142" fill="#DDA43B" stroke="#141817" strokeWidth="3" />
      <g clipPath="url(#serigrafia-sun-clip)" opacity="0.26">
        <rect x="280" y="52" width="290" height="290" fill="url(#serigrafia-halftone)" />
      </g>

      <g fill="none" stroke="#141817" strokeWidth="3" strokeLinecap="round">
        <path d="M300 444c18-78 27-144 31-220" />
        <path d="M331 224c-36-4-65-20-82-47M331 224c35-10 59-31 71-62M331 224c-25-30-34-59-26-90M331 224c-5-40 9-70 34-94M331 224c20-28 48-45 81-51" />
        <path d="M332 238c-25-12-47-11-67 4M332 238c29-8 50-2 65 16" />
      </g>
      <g fill="#2D5224" opacity="0.92">
        <path d="M331 224c-36-4-65-20-82-47 31 1 58 17 82 47Z" />
        <path d="M331 224c35-10 59-31 71-62-33 7-58 28-71 62Z" />
        <path d="M331 224c-25-30-34-59-26-90 17 26 26 56 26 90Z" />
        <path d="M331 224c-5-40 9-70 34-94-3 34-17 65-34 94Z" />
      </g>

      <g stroke="#F5F3EC" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M92 102c6-6 12-6 18 0M102 116c6-5 12-5 18 0M132 86c5-5 10-5 15 0" />
      </g>

      <g>
        <rect x="58" y="346" width="244" height="132" fill="#9E2A22" stroke="#141817" strokeWidth="3" />
        <path d="M58 346h244v20H58Z" fill="#141817" opacity="0.2" />
        <rect x="82" y="386" width="38" height="54" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <rect x="132" y="386" width="38" height="54" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <rect x="182" y="386" width="38" height="54" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <rect x="232" y="386" width="38" height="54" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <g stroke="#141817" strokeWidth="1.4">
          <path d="M101 386v54M151 386v54M201 386v54M251 386v54" />
        </g>
      </g>

      <g>
        <rect x="358" y="392" width="226" height="86" fill="#9E2A22" stroke="#141817" strokeWidth="3" />
        <rect x="382" y="418" width="32" height="38" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <rect x="430" y="418" width="32" height="38" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <rect x="478" y="418" width="32" height="38" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
        <rect x="526" y="418" width="32" height="38" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
      </g>

      <g stroke="#141817" strokeWidth="2.4" fill="none">
        <path d="M78 520V74" />
        <path d="M38 104h80M48 126h60M48 148h60" />
      </g>
      <g stroke="#F5F3EC" strokeWidth="2" fill="none" opacity="0.95">
        <path d="M48 104c86 18 140-20 226-10s154 44 342 8" />
        <path d="M48 126c76-15 144 12 214 3s166-31 344-10" />
        <path d="M48 148c104 23 166-4 250-8s142 19 318 2" />
      </g>
      <g stroke="#141817" strokeWidth="1.6" fill="none" opacity="0.85">
        <path d="M48 104c86 18 140-20 226-10s154 44 342 8" />
        <path d="M48 126c76-15 144 12 214 3s166-31 344-10" />
      </g>
      <g fill="#F5F3EC" stroke="#141817" strokeWidth="1.5">
        <rect x="32" y="96" width="9" height="16" rx="2" />
        <rect x="32" y="118" width="9" height="16" rx="2" />
        <rect x="32" y="140" width="9" height="16" rx="2" />
        <rect x="116" y="98" width="9" height="14" rx="2" />
      </g>

      <g transform="rotate(-2 520 466)">
        <rect x="474" y="446" width="94" height="34" fill="#F5F3EC" stroke="#141817" strokeWidth="2.5" />
        <text x="521" y="469" textAnchor="middle" fontFamily="Arial Black, Impact, sans-serif" fontSize="18" fill="#9E2A22">2016</text>
      </g>

      <g opacity="0.25">
        <rect x="58" y="346" width="244" height="132" fill="url(#serigrafia-halftone)" />
        <rect x="358" y="392" width="226" height="86" fill="url(#serigrafia-halftone)" />
      </g>
    </svg>
  );
}

export default function HeroArtwork() {
  const { activeEra } = useEra();
  return activeEra === 'todo-queda-aca' ? <KitchenScene /> : <SerigraphyScene />;
}
