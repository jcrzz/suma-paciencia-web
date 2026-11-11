import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import { Select } from '@/components/ui/Field';
import { StatusBadge } from '@/pages/admin/OrdersAdminPage';
import { useToast } from '@/context/ToastContext';
import { getOrder, updateOrderStatus } from '@/lib/repositories/orders';
import { buildWhatsAppLink, DELIVERY_LABELS } from '@/lib/whatsapp';
import { formatDateTime, formatPrice } from '@/lib/utils';
import type { Order, OrderItem, OrderStatus } from '@/types';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!id) return;
    getOrder(id)
      .then(({ order: found, items: foundItems }) => {
        setOrder(found);
        setItems(foundItems);
      })
      .catch(() => push('No pudimos cargar el pedido', 'error'));
  }, [id, push]);

  if (!order) {
    return (
      <div>
        <AdminPageHeader title="Pedido" />
        <p className="text-sm text-[var(--muted)]">Cargando…</p>
      </div>
    );
  }

  const handleStatus = async (status: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
      push('Estado actualizado', 'success');
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos actualizar el estado', 'error');
    }
  };

  const whatsappMessage = [
    `Hola ${order.customer_name}, te escribimos de Suma Paciencia por tu pedido ${order.order_number}.`,
    `Total: ${formatPrice(order.total)}`,
    '¿Nos confirmás los datos de entrega?',
  ].join('\n');

  return (
    <div>
      <AdminPageHeader
        title={`Pedido ${order.order_number}`}
        description={`Registrado el ${formatDateTime(order.created_at)}`}
        action={
          <Link
            to="/admin/pedidos"
            className="inline-flex items-center gap-2 border border-[var(--line-light)] px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        }
      />

      <div className="grid xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-6">
          <section className="border border-[var(--line-light)]">
            <header className="px-5 py-4 border-b border-[var(--line-light)] flex items-center justify-between">
              <h2 className="display font-bold text-[var(--paper)]">Items</h2>
              <StatusBadge status={order.status} />
            </header>
            <ul className="divide-y divide-[var(--line-light)]">
              {items.map((item) => (
                <li key={item.id} className="px-5 py-4 flex justify-between gap-4">
                  <div>
                    <p className="text-sm text-[var(--paper)]">{item.product_name}</p>
                    <p className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)] mt-1">
                      {item.quantity} × talle {item.size ?? 'Único'} · {formatPrice(item.unit_price)} c/u
                    </p>
                  </div>
                  <p className="mono text-sm text-[var(--ocre)] whitespace-nowrap">{formatPrice(item.subtotal)}</p>
                </li>
              ))}
              {items.length === 0 && (
                <li className="px-5 py-6 text-sm text-[var(--muted)] text-center">Sin items cargados.</li>
              )}
            </ul>
            <div className="flex justify-between px-5 py-4 border-t border-[var(--line-light)] bg-[var(--monte)]/50">
              <span className="display font-bold">Total</span>
              <span className="display text-xl font-bold text-[var(--ocre)]">{formatPrice(order.total)}</span>
            </div>
          </section>

          <section className="border border-[var(--line-light)] p-5">
            <h2 className="display font-bold text-[var(--paper)] mb-4">Estado del pedido</h2>
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-56">
                <Select
                  label="Estado"
                  value={order.status}
                  onChange={(e) => handleStatus(e.target.value as OrderStatus)}
                  options={STATUS_OPTIONS}
                />
              </div>
              <p className="text-xs text-[var(--muted)] mb-2.5">
                Método de pago: {order.payment_method === 'whatsapp' ? 'Transferencia + WhatsApp' : 'Mercado Pago'}
              </p>
            </div>
          </section>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <section className="border border-[var(--line-light)] p-5 space-y-3">
            <h2 className="display font-bold text-[var(--paper)]">Comprador</h2>
            <p className="text-sm text-[var(--paper)]">{order.customer_name}</p>
            <a
              href={`mailto:${order.customer_email}`}
              className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
            >
              <Mail className="h-4 w-4 text-[var(--ocre)]" /> {order.customer_email}
            </a>
            <a
              href={`tel:${order.customer_phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
            >
              <Phone className="h-4 w-4 text-[var(--ocre)]" /> {order.customer_phone}
            </a>
            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-3 bg-[var(--ocre)] text-[var(--ink)] font-[Fraunces_VF] font-bold px-4 py-2.5 hover:bg-[var(--paper)] transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
            </a>
          </section>

          <section className="border border-[var(--line-light)] p-5 space-y-2">
            <h2 className="display font-bold text-[var(--paper)] mb-2">Entrega</h2>
            <p className="text-sm text-[var(--muted)]">{DELIVERY_LABELS[order.delivery_method]}</p>
            {order.shipping_address && (
              <p className="text-sm text-[var(--paper)]">
                {order.shipping_address}
                <br />
                {order.shipping_city}, {order.shipping_province}
                {order.shipping_postal_code ? ` (${order.shipping_postal_code})` : ''}
              </p>
            )}
            {order.notes && (
              <p className="text-sm text-[var(--muted)] pt-2 border-t border-[var(--line-light)] mt-3">
                <span className="mono text-[0.62rem] uppercase tracking-[0.12em] block text-[var(--muted)] mb-1">
                  Notas
                </span>
                {order.notes}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
