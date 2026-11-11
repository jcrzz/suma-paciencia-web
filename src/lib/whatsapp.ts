import { env } from '@/lib/config';
import type { CartItem, DeliveryMethod, Order } from '@/types';

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  shipping: 'Envío a domicilio',
  pickup_uruguay: 'Retiro en Concepción del Uruguay',
  pickup_show: 'Retiro en una fecha',
};

/** Arma el mensaje pre-cargado para cerrar el pedido por WhatsApp. */
export function buildOrderMessage(order: Order, items: CartItem[]): string {
  const lines: string[] = [];
  lines.push(`Hola Suma Paciencia, soy ${order.customer_name}.`);
  lines.push(`Acabo de hacer el pedido ${order.order_number} en la web.`);
  lines.push('');
  lines.push('Items:');
  items.forEach((item) => {
    lines.push(`• ${item.quantity} x ${item.name} (talle ${item.size}) — ${formatPlainPrice(item.price * item.quantity)}`);
  });
  lines.push('');
  lines.push(`Entrega: ${DELIVERY_LABELS[order.delivery_method]}`);
  lines.push(`Total: ${formatPlainPrice(order.total)}`);
  if (order.notes) {
    lines.push('');
    lines.push(`Notas: ${order.notes}`);
  }
  lines.push('');
  lines.push('Adjunto el comprobante de la transferencia.');
  return lines.join('\n');
}

export function formatPlainPrice(amount: number): string {
  return `$${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(amount)}`;
}

export function buildWhatsAppLink(message: string, phone: string = env.WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Mensaje simple para contactar a la banda (EPK, booking, compras). */
export function buildContactLink(message: string, phone: string = env.WHATSAPP_NUMBER): string {
  return buildWhatsAppLink(message, phone);
}
