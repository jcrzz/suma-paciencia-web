import { env } from '@/lib/config';

export type MercadoPagoPreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
};

export type CreatePreferenceInput = {
  orderId: string;
  orderNumber: string;
  items: { title: string; unit_price: number; quantity: number }[];
  payer: { name: string; email: string; phone?: string };
};

/**
 * Hook de Mercado Pago. El frontend llama a la Serverless Function de Vercel
 * (`api/create-preference.ts`) y la función se encarga de firmar la preferencia
 * con el ACCESS_TOKEN (que nunca viaja al navegador).
 *
 * Cuando `VITE_MP_ENABLED` no está activo, devuelve `null` y el checkout
 * ofrece únicamente transferencia por alias + WhatsApp.
 */
export async function createMercadoPagoPreference(
  input: CreatePreferenceInput
): Promise<MercadoPagoPreferenceResponse | null> {
  if (!env.MP_ENABLED) return null;

  const response = await fetch(env.MP_PREFERENCE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo generar la preferencia de Mercado Pago (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as MercadoPagoPreferenceResponse;
  return data;
}

export function isMercadoPagoEnabled(): boolean {
  return env.MP_ENABLED;
}
