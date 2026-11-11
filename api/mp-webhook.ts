/**
 * api/mp-webhook.ts · Vercel Serverless Function
 *
 * Recibe las notificaciones de Mercado Pago cuando cambia el estado de un pago
 * y actualiza el pedido en Supabase (misma base de datos que usa la web).
 *
 * CONFIGURACIÓN:
 *   MERCADOPAGO_ACCESS_TOKEN  = ACCESS_TOKEN (para consultar /v1/payments/{id})
 *   SUPABASE_URL              = URL del proyecto
 *   SUPABASE_SERVICE_ROLE_KEY = service role key (SOLO servidor, nunca en el front)
 *   MP_WEBHOOK_SECRET         = secreto compartido para validar la llamada
 *
 * En Mercado Pago (panel de la app) => "Notificaciones" => URL:
 *   https://tu-dominio/api/mp-webhook
 *
 * Flujo:
 *   1. Mercado Pago manda { type, action, data: { id } }.
 *   2. Consultamos el pago para conocer su estado real (nunca confiar en el body).
 *   3. Traducimos el estado a nuestro status de pedido:
 *        approved  -> paid
 *        pending   -> pending
 *        rejected  -> cancelled
 *        refunded  -> cancelled
 *   4. Actualizamos public.orders por external_reference = orderId.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

type MercadoPagoNotification = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

type Payment = {
  id: number;
  status: 'approved' | 'pending' | 'rejected' | 'refunded' | 'cancelled' | 'in_process';
  external_reference?: string;
  transaction_amount?: number;
  payment_method_id?: string;
};

const STATUS_MAP: Record<Payment['status'], 'paid' | 'pending' | 'cancelled'> = {
  approved: 'paid',
  pending: 'pending',
  in_process: 'pending',
  rejected: 'cancelled',
  refunded: 'cancelled',
  cancelled: 'cancelled',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const secret = process.env.MP_WEBHOOK_SECRET;
  if (secret && req.headers['x-webhook-secret'] !== secret) {
    return res.status(401).json({ error: 'Secreto inválido' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!accessToken || !supabaseUrl || !serviceKey) {
    return res.status(500).json({
      error: 'Faltan MERCADOPAGO_ACCESS_TOKEN, SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY',
    });
  }

  const notification = (req.body ?? {}) as MercadoPagoNotification;
  const paymentId = notification?.data?.id;

  if (!paymentId) {
    return res.status(200).json({ received: true, ignored: 'sin payment id' });
  }

  try {
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!paymentResponse.ok) {
      return res.status(502).json({ error: 'No se pudo consultar el pago' });
    }

    const payment = (await paymentResponse.json()) as Payment;
    const orderId = payment.external_reference;

    if (!orderId) {
      return res.status(200).json({ received: true, ignored: 'el pago no tiene external_reference' });
    }

    const orderStatus = STATUS_MAP[payment.status] ?? 'pending';
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error('mp-webhook supabase error', error);
      return res.status(500).json({ error: 'No se pudo actualizar el pedido' });
    }

    return res.status(200).json({ received: true, order_id: orderId, status: orderStatus });
  } catch (error) {
    console.error('mp-webhook error', error);
    return res.status(500).json({ error: 'Error procesando la notificación' });
  }
}
