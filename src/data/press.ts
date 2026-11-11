export type PressFeature = {
  id: string;
  source: string;
  title: string;
  year: string;
  excerpt: string;
  url: string;
  tag: 'entrevista' | 'lanzamiento' | 'reseña';
};

export const pressFeatures: PressFeature[] = [
  {
    id: 'la-mala-16-anos',
    source: 'La Mala',
    title: 'Un camino de 16 años: nunca dejaron de crecer y de tocar',
    year: '2025',
    excerpt:
      'Una conversación sobre la autogestión, los escenarios compartidos y la obstinación de sostener un proyecto propio.',
    url: 'https://lamalarevista.com.ar/articulo/suma-paciencia-un-camino-de-16-anos/',
    tag: 'entrevista',
  },
  {
    id: 'indie-hoy-tqca',
    source: 'Indie Hoy',
    title: 'Suma Paciencia amplía su propuesta de reggae con cruces de soul',
    year: '2026',
    excerpt:
      '“Todo queda acá” aparece entre los lanzamientos de la semana: nueve canciones que corren los límites del reggae.',
    url: 'https://indiehoy.com/noticias/10-lanzamientos-para-escuchar-esta-semana-2026-10-26/',
    tag: 'lanzamiento',
  },
  {
    id: 'reggae-es-debut',
    source: 'Reggae.es',
    title: 'Suma Paciencia debuta con su primer álbum',
    year: '2016',
    excerpt:
      'Influenciados por el sonido jamaicano de los 70, la banda argentina presentó un proyecto de canciones propias.',
    url: 'http://www.reggae.es/2016/08/26/suma-paciencia-debuta-con-su-primer-album/',
    tag: 'reseña',
  },
];
