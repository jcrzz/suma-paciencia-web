export type EraId = 'todo-queda-aca' | 'homonimo-2016';

export type EraMeta = {
  id: EraId;
  title: string;
  year: string;
  shortLabel: string;
  artDirection: string;
  heroSubtitle: string;
  albumId: string;
  actionLabel: string;
  heroCredit: string;
};

export const ERAS: EraMeta[] = [
  {
    id: 'todo-queda-aca',
    title: 'Todo queda acá',
    year: '2026',
    shortLabel: 'Disco Nuevo · Todo Queda Acá',
    artDirection: 'Ilustración íntima hogareña · Carlos Rodríguez Puente',
    heroSubtitle: 'El viaje de Félix · 9 canciones desde Concepción del Uruguay',
    albumId: 'todo-queda-aca',
    actionLabel: 'Ir a Era 2016',
    heroCredit: 'ARTE X CARLOS RODRÍGUEZ PUENTE · ANIMACIÓN: EL VIAJE DE FÉLIX',
  },
  {
    id: 'homonimo-2016',
    title: 'Suma Paciencia',
    year: '2016',
    shortLabel: '1er Disco · Homónimo (2016)',
    artDirection: 'Serigrafía urbana & Xilografía de barrio',
    heroSubtitle: 'Reggae litoraleño de raíz · Edición fundacional',
    albumId: 'suma-paciencia',
    actionLabel: 'Ir a Era Nuevo Disco',
    heroCredit: 'SERIGRAFÍA URBANA · 7 LÁMINAS · EDICIÓN 2016',
  },
];

export const DEFAULT_ERA: EraId = 'todo-queda-aca';

export function getEraMeta(id: EraId): EraMeta {
  return ERAS.find((era) => era.id === id) ?? ERAS[0];
}
