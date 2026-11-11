import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Printer } from 'lucide-react';
import BankSheet from '@/components/shop/BankSheet';
import { getEpkInfo } from '@/lib/repositories/epk';
import { getOrder } from '@/lib/repositories/orders';
import { buildOrderMessage, buildWhatsAppLink, DELIVERY_LABELS } from '@/lib/whatsapp';
import { formatPrice, formatDateTime } from '@/lib/utils';
import type { EpkInfo, Order, OrderItem } from '@/types';

type Stored = { order: Order; items: OrderItem[] };

function readStoredOrder(): Stored | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem('sp_last_order');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Stored;
  } catch {
    return null;
  }
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const [data, setData] = useState<Stored | null>(readStoredOrder);
  const [epk, setEpk] = useState<EpkInfo | null>(null);

  useEffect(() => {
    getEpkInfo().then(setEpk).catch(() => setEpk(null));

    if (readStoredOrder()) return;
    const orderId = (location.state as { orderId?: string } | null)?.orderId;
    if (!orderId) return;
    getOrder(orderId)
      .then(({ order, items }) => {
        if (order) setData({ order, items });
      })
      .catch(() => setData(null));
  }, [location.state]);

  if (!data) {
    return (
      <div className="pt-32 pb-24 max-w-[560px] mx-auto px-5 text-center">
        <h1 className="display text-3xl font-bold text-[var(--text-primary)]">No encontramos tu pedido</h1>
        <p className="text-[var(--text-on-surface-secondary)] mt-3">
          Puede que el link haya expirado. Escribinos por WhatsApp y lo buscamos.
        </p>
        <Link
          to="/tienda"
          className="inline-block mt-6 bg-[var(--accent-primary)] text-[var(--text-on-surface)] font-[Fraunces_VF] font-bold px-6 py-3 hover:bg-[var(--accent-secondary)] transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const { order, items } = data;
  const whatsappHref = buildWhatsAppLink(buildOrderMessage(order, items.map((item) => ({
    productId: item.product_id ?? '',
    variantId: item.variant_id,
    size: item.size ?? 'Único',
    quantity: item.quantity,
    name: item.product_name,
    price: item.unit_price,
    image: '',
  }))));

  return (
    <div className="pt-24 sm:pt-28">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-12">
        <div className="text-center">
          <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--status-ok)]">Pedido registrado</p>
          <h1 className="display text-[clamp(2.2rem,7vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
            GRACIAS, {order.customer_name.split(' ')[0].toUpperCase()}
          </h1>
          <p className="text-[var(--text-on-surface-secondary)] max-w-[52ch] mx-auto mt-4 leading-relaxed">
            Tu pedido quedó guardado. Transferí el total y mandanos el comprobante por WhatsApp con el
            número de pedido para que lo confirmemos.
          </p>
        </div>

        <div className="mt-10 border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-alt)]">
            <div>
              <span className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-on-surface-secondary)] block">Pedido</span>
              <span className="display text-xl font-bold">{order.order_number}</span>
            </div>
            <div className="text-right">
              <span className="mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-on-surface-secondary)] block">Fecha</span>
              <span className="mono text-xs">{formatDateTime(order.created_at)}</span>
            </div>
          </div>

          <ul className="divide-y divide-[var(--border-subtle)]">
            {items.map((item) => (
              <li key={item.id} className="px-5 sm:px-7 py-4 flex justify-between gap-4">
                <div>
                  <p className="font-[Fraunces_VF] font-bold">{item.product_name}</p>
                  <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)] mt-1">
                    {item.quantity} × talle {item.size ?? 'Único'}
                  </p>
                </div>
                <p className="mono text-sm whitespace-nowrap">{formatPrice(item.subtotal)}</p>
              </li>
            ))}
          </ul>

          <dl className="border-t border-[var(--border-subtle)]">
            <div className="flex justify-between gap-4 px-5 sm:px-7 py-3">
              <dt className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">Entrega</dt>
              <dd className="text-sm text-right">{DELIVERY_LABELS[order.delivery_method]}</dd>
            </div>
            {order.shipping_address && (
              <div className="flex justify-between gap-4 px-5 sm:px-7 py-3">
                <dt className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">Dirección</dt>
                <dd className="text-sm text-right">
                  {order.shipping_address}, {order.shipping_city}, {order.shipping_province}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4 px-5 sm:px-7 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-alt)]">
              <dt className="display font-bold text-lg">Total</dt>
              <dd className="display text-2xl font-bold">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6">
          <BankSheet
            alias={epk?.transfer_alias}
            cbu={epk?.transfer_cbu}
            holder={epk?.transfer_holder}
            bank={epk?.transfer_bank}
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-[var(--text-on-surface)] font-[Fraunces_VF] font-bold px-6 py-4 hover:bg-[var(--accent-secondary)] transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Enviar el pedido por WhatsApp
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 border border-[var(--border-subtle)] px-6 py-4 font-[Fraunces_VF] font-bold hover:border-[var(--border-primary)] transition-colors"
          >
            <Printer className="h-4 w-4" /> Imprimir
          </button>
        </div>

        <p className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)] mt-6 text-center">
          Guardá este número de pedido: {order.order_number}
        </p>
      </div>
    </div>
  );
}
