/**
 * api/create-preference.ts · Vercel Serverless Function
 *
 * Crea una preferencia de pago en Mercado Pago para un pedido de la tienda.
 *
 * CONFIGURACIÓN (variables de entorno del proyecto en Vercel):
 *   MERCADOPAGO_ACCESS_TOKEN  = ACCESS_TOKEN de producción (o de prueba)
 *   MP_SUCCESS_URL            = URL de retorno (ej: https://sumapaciencia.com.ar/pedido/confirmacion)
 *   MP_PENDING_URL            = URL de retorno si el pago queda pendiente
 *   MP_FAIL_URL               = URL de retorno si el pago falla
 *   MP_NOTIFICATION_URL       = URL pública de este webhook: https://tu-dominio/api/mp-webhook
 *
 * En el frontend se activa con VITE_MP_ENABLED=true y
 * VITE_MP_PREFERENCE_ENDPOINT=/api/create-preference
 *
 * Nota: el ACCESS_TOKEN NUNCA viaja al navegador: solo vive en el servidor.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

type Item = { title: string; unit_price: number; quantity: number };

type CreatePreferenceBody = {
  orderId: string;
  orderNumber: string;
  items: Item[];
  payer: { name: string; email: string; phone?: string };
};

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const SITE_URL = process.env.MP_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  if (!ACCESS_TOKEN) {
    return res.status(500).json({
      error: 'Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno del servidor',
    });
  }

  const body = req.body as CreatePreferenceBody | undefined;
  if (!body?.orderId || !body?.items?.length || !body?.payer?.email) {
    return res.status(400).json({ error: 'Payload incompleto' });
  }

  const baseUrl = SITE_URL ? `https://${SITE_URL.replace(/^https?:\/\//, '')}` : '';
  const total = body.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const preference = {
    items: body.items.map((item) => ({
      title: item.title,
      unit_price: item.unit_price,
      quantity: item.quantity,
      currency_id: 'ARS',
    })),
    payer: {
      name: body.payer.name,
      email: body.payer.email,
      phone: body.payer.phone ? { number: body.payer.phone.replace(/\D/g, '') } : undefined,
    },
    external_reference: body.orderId,
    notification_url: process.env.MP_NOTIFICATION_URL,
    back_urls: {
      success: process.env.MP_SUCCESS_URL ?? `${baseUrl}/pedido/confirmacion`,
      pending: process.env.MP_PENDING_URL ?? `${baseUrl}/pedido/confirmacion`,
      failure: process.env.MP_FAIL_URL ?? `${baseUrl}/checkout`,
    },
    auto_return: 'approved',
    metadata: {
      order_number: body.orderNumber,
    },
    statement_descriptor: 'SUMA PACIENCIA',
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mercado Pago error', response.status, data);
      return res.status(502).json({
        error: 'Mercado Pago rechazó la preferencia',
        detail: data?.message ?? data,
      });
    }

    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      total,
    });
  } catch (error) {
    console.error('create-preference error', error);
    return res.status(500).json({ error: 'No se pudo generar la preferencia de pago' });
  }
}
