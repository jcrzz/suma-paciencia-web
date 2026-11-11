export type ArtStyle = 'tqca' | 'clasico' | 'romaphonic' | 'trigo' | 'single';

export type Track = {
  number: number;
  title: string;
  duration: string;
  lyrics: string | null;
};

export type Album = {
  id: string;
  title: string;
  year: number;
  kind: 'album' | 'ep' | 'single';
  art: ArtStyle;
  artLabel: string;
  artSub: string;
  label: string;
  duration: string;
  tracks: Track[];
  spotify: string | null;
  youtube: string | null;
  note: string | null;
};

const SPOTIFY_ARTIST_SEARCH = 'https://open.spotify.com/search/Suma%20Paciencia';
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@sumapaciencia';

const TRIGO_Y_SAL_LYRICS = `Soy trigo, soy sal
Soy presa del ajedrez comercial
Ficha que puede jugar
Mientras pueda la rueda girar
Y es así, aunque le cueste escuchar
No duelen las palabras
Lo que duele es la verdad
Y es así, aunque le cueste escuchar
No duelen las palabras

Cuando llegué, ya estaba ahí
Yo no elegí
Eso no te enseñan en la escuela
Soy eslabón de la cadena
Y me da pena
Ser cómplice de mi condena
Engranaje
Aunque mi espíritu no encaje
Eso no me desanima
Si escucha le pido
Busquemos una alternativa

Busquemos una alternativa
Una escapatoria, una opción al paradigma
La estafa está montada
La suerte ya está echada
La ironía demostrada
Ya descubrimos la trama
Que ahora mismo se desarma
Un sistema que se mueve al son de un papel
Banco mundial lo fabrica a su placer
Lo vende a los estados con su cuota de interés
Que pagan lo que llevan, con el mismo papel
La deuda es infinita
Ecuación y matemática que irrita
El apetito de poder no se limita
Si de guerras y vacunas
Son los financistas
No hay teoría que resista
Lo taparon, quedó a la vista
No es un pensar caótico, ni dramático
Es un pensamiento crítico
Dudar de lo que viene dado como obvio
Analizar quién gana en un sistema improductivo

No quiero ser un muerto vivo
Quiero ser la duda inquieta, la filosofía, ser
Naturaleza reaccionando a la defensiva
No quiero ser espectador en esta vida
Quiero ser revolución, evolución y alternativa
No quiero ser espectador en esta vida
Quiero ser revolución
Evolución
Alternativa

Quisiera saber como fue que empezó
¿Quién puede poner precio al tiempo?
¿Quién se atrevió, a decirme
Que yo solo puedo estar fuera o dentro?
Creo en otra realidad
Soy trigo, soy sal`;

export const albums: Album[] = [
  {
    id: 'todo-queda-aca',
    title: 'Todo queda acá',
    year: 2026,
    kind: 'album',
    art: 'tqca',
    artLabel: 'TODO\nQUEDA\nACÁ',
    artSub: 'SUMA PACIENCIA · 9 CANCIONES',
    label: 'Impronta Music',
    duration: '37:30',
    note: 'Roots, lovers y steppers con soul, axé y electrónica. Con Ras Kuko en “Nos Subestiman” y Nonpalidece en “La Nueva Generación”.',
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: 'https://www.youtube.com/@sumapaciencia',
    tracks: [
      { number: 1, title: 'Nos Subestiman (feat. Ras Kuko)', duration: '4:20', lyrics: null },
      { number: 2, title: 'Baja', duration: '3:48', lyrics: null },
      { number: 3, title: 'Cosas Buenas', duration: '4:28', lyrics: null },
      { number: 4, title: 'Claro que te extraño', duration: '3:45', lyrics: null },
      { number: 5, title: 'Casual', duration: '4:04', lyrics: null },
      { number: 6, title: 'Vamos a Jugar', duration: '4:14', lyrics: null },
      { number: 7, title: 'La Nueva Generación (feat. Nonpalidece)', duration: '4:44', lyrics: null },
      { number: 8, title: 'No me Representan', duration: '4:08', lyrics: null },
      { number: 9, title: 'Nada me Amenaza', duration: '3:59', lyrics: null },
    ],
  },
  {
    id: 'suma-paciencia',
    title: 'Suma Paciencia',
    year: 2016,
    kind: 'album',
    art: 'clasico',
    artLabel: 'SUMA\nPACIENCIA',
    artSub: 'DEBUT · 7 CANCIONES',
    label: 'Suma Paciencia',
    duration: '32:28',
    note: 'Grabado en Salas Gallo (Almagro, Buenos Aires). Con Pablo Molina en “Celebra” y Hugo Lobo en “Depende de mí”.',
    spotify: 'https://open.spotify.com/album/37LeAk80CuwFd9tViKaHys',
    youtube: YOUTUBE_CHANNEL,
    tracks: [
      { number: 1, title: 'Depende de mí (feat. Hugo Lobo)', duration: '4:51', lyrics: null },
      { number: 2, title: 'Celebra (feat. Pablo Molina)', duration: '4:46', lyrics: null },
      { number: 3, title: 'Lírica en prosa', duration: '3:35', lyrics: null },
      { number: 4, title: 'Ambición', duration: '3:41', lyrics: null },
      { number: 5, title: 'Todos Buscamos', duration: '3:33', lyrics: null },
      { number: 6, title: 'Te Callas', duration: '6:54', lyrics: null },
      { number: 7, title: 'Sin Darte Cuenta', duration: '5:04', lyrics: null },
    ],
  },
  {
    id: 'romaphonic',
    title: 'En Vivo — Estudio Romaphonic',
    year: 2018,
    kind: 'ep',
    art: 'romaphonic',
    artLabel: 'ROMAPHONIC',
    artSub: 'EP EN VIVO · 4 CANCIONES',
    label: 'Suma Paciencia',
    duration: '4 temas',
    note: 'Grabado en vivo en los estudios Romaphonic, uno de los espacios de grabación más importantes de Latinoamérica.',
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'trigo-y-sal',
    title: 'Trigo y Sal',
    year: 2024,
    kind: 'single',
    art: 'trigo',
    artLabel: 'TRIGO\nY SAL',
    artSub: 'SINGLE · SOUL',
    label: 'Suma Paciencia',
    duration: '5:21',
    note: 'Un salto hacia el soul con Abril Olivera, Julieta Rada y el groove de Nafta y Los Cafres.',
    spotify: 'https://open.spotify.com/album/37LeAk80CuwFd9tViKaHys',
    youtube: 'https://www.youtube.com/watch?v=wKi0hlPJJ1U',
    tracks: [
      { number: 1, title: 'Trigo y Sal', duration: '5:21', lyrics: TRIGO_Y_SAL_LYRICS },
    ],
  },
];

export const singles: Album[] = [
  {
    id: 'puedo-afirmar',
    title: 'Puedo Afirmar',
    year: 2025,
    kind: 'single',
    art: 'single',
    artLabel: 'PUEDO\nAFIRMAR',
    artSub: '2025',
    label: 'Suma Paciencia',
    duration: '4:04',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'cosas-buenas',
    title: 'Cosas Buenas',
    year: 2025,
    kind: 'single',
    art: 'single',
    artLabel: 'COSAS\nBUENAS',
    artSub: '2025',
    label: 'Suma Paciencia',
    duration: '4:28',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'claro-que-te-extraño',
    title: 'Claro que te extraño',
    year: 2025,
    kind: 'single',
    art: 'single',
    artLabel: 'CLARO QUE\nTE EXTRAÑO',
    artSub: '2025',
    label: 'Suma Paciencia',
    duration: '3:45',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'tolerancia',
    title: 'Tolerancia',
    year: 2024,
    kind: 'single',
    art: 'single',
    artLabel: 'TOLERANCIA',
    artSub: '2024',
    label: 'Suma Paciencia',
    duration: '5:04',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'mis-manos',
    title: 'Mis Manos',
    year: 2024,
    kind: 'single',
    art: 'single',
    artLabel: 'MIS MANOS',
    artSub: '2024',
    label: 'Suma Paciencia',
    duration: '4:00',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'underdog',
    title: 'Underdog',
    year: 2021,
    kind: 'single',
    art: 'single',
    artLabel: 'UNDERDOG',
    artSub: '2021',
    label: 'Suma Paciencia',
    duration: '3:52',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'los-43',
    title: 'Los 43',
    year: 2021,
    kind: 'single',
    art: 'single',
    artLabel: 'LOS 43',
    artSub: '2021',
    label: 'Suma Paciencia',
    duration: '3:58',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'la-gente-como-tu',
    title: 'La Gente Como Tú',
    year: 2021,
    kind: 'single',
    art: 'single',
    artLabel: 'LA GENTE\nCOMO TÚ',
    artSub: '2021',
    label: 'Suma Paciencia',
    duration: '4:02',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'sin-darte-cuenta',
    title: 'Sin Darte Cuenta',
    year: 2022,
    kind: 'single',
    art: 'single',
    artLabel: 'SIN DARTE\nCUENTA',
    artSub: '2022',
    label: 'Suma Paciencia',
    duration: '3:55',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'por-que-te-vas',
    title: '¿Por qué te vas?',
    year: 2022,
    kind: 'single',
    art: 'single',
    artLabel: '¿POR QUÉ\nTE VAS?',
    artSub: '2022',
    label: 'Suma Paciencia',
    duration: '4:06',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'ya-veras',
    title: 'Ya Verás',
    year: 2021,
    kind: 'single',
    art: 'single',
    artLabel: 'YA VERÁS',
    artSub: '2021',
    label: 'Suma Paciencia',
    duration: '3:47',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
  {
    id: 'suelta-la-carga',
    title: 'Suelta La Carga (En Vivo)',
    year: 2022,
    kind: 'single',
    art: 'single',
    artLabel: 'SUELTA\nLA CARGA',
    artSub: '2022 · EN VIVO',
    label: 'Suma Paciencia',
    duration: '5:10',
    note: null,
    spotify: SPOTIFY_ARTIST_SEARCH,
    youtube: YOUTUBE_CHANNEL,
    tracks: [],
  },
];

export const featuredAlbum = albums[0];
