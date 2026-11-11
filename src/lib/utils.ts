const ARG_TIMEZONE = 'America/Argentina/Buenos_Aires';

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPricePlain = (amount: number): string =>
  `$ ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(amount)}`;

export function formatDateLong(iso: string): { day: string; monthYear: string; weekday: string; full: string } {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat('es-AR', { day: '2-digit', timeZone: ARG_TIMEZONE }).format(date);
  const monthYear = new Intl.DateTimeFormat('es-AR', { month: 'short', year: 'numeric', timeZone: ARG_TIMEZONE })
    .format(date)
    .replace('.', '');
  const weekday = new Intl.DateTimeFormat('es-AR', { weekday: 'long', timeZone: ARG_TIMEZONE })
    .format(date)
    .toUpperCase();
  const full = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: ARG_TIMEZONE }).format(date);
  return { day, monthYear, weekday, full };
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ARG_TIMEZONE,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  const { full } = formatDateLong(iso);
  return `${full} · ${formatTime(iso)} hs`;
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: ARG_TIMEZONE }).format(new Date(iso));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatPhoneForWhatsapp(phone: string): string {
  return phone.replace(/\D/g, '');
}
