import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AdminPageHeader, AdminEmptyState } from '@/components/admin/AdminUI';
import { listOrders } from '@/lib/repositories/orders';
import { formatDateTime, formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const STATUS_FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendiente' },
  { key: 'paid', label: 'Pagado' },
  { key: 'shipped', label: 'Enviado' },
  { key: 'delivered', label: 'Entregado' },
  { key: 'cancelled', label: 'Cancelado' },
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    listOrders().then(setOrders).catch(() => undefined);
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const matchesSearch =
        term.length === 0 ||
        order.order_number.toLowerCase().includes(term) ||
        order.customer_name.toLowerCase().includes(term) ||
        order.customer_email.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, status, search]);

  return (
    <div>
      <AdminPageHeader
        title="Pedidos"
        description="Ventas de la tienda oficial: estado, datos del comprador y acceso directo al chat de WhatsApp."
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatus(filter.key)}
              className={`mono text-[0.66rem] uppercase tracking-[0.13em] px-3.5 py-2 border transition-colors ${
                status === filter.key
                  ? 'bg-[var(--ocre)] text-[var(--ink)] border-[var(--ocre)]'
                  : 'border-[var(--line-light)] text-[var(--muted)] hover:border-[var(--paper)] hover:text-[var(--paper)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative lg:ml-auto w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, nombre o email"
            className="w-full bg-transparent border border-[var(--line-light)] pl-9 pr-3 py-2.5 text-sm text-[var(--paper)] placeholder:text-[var(--muted)]/70 focus:outline-none focus:border-[var(--ocre)] transition-colors"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <AdminEmptyState
          title="No hay pedidos para mostrar"
          hint={orders.length ? 'Probá con otro filtro o término de búsqueda.' : 'Los pedidos de la tienda van a aparecer acá.'}
        />
      ) : (
        <div className="border border-[var(--line-light)] overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-[var(--line-light)] mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                <th className="px-4 py-3 font-normal">Pedido</th>
                <th className="px-4 py-3 font-normal">Comprador</th>
                <th className="px-4 py-3 font-normal">Entrega</th>
                <th className="px-4 py-3 font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Estado</th>
                <th className="px-4 py-3 font-normal text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-light)]">
              {visible.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--monte)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="mono text-xs text-[var(--paper)]">{order.order_number}</p>
                    <p className="mono text-[0.6rem] text-[var(--muted)] mt-0.5">{formatDateTime(order.created_at)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[var(--paper)]">{order.customer_name}</p>
                    <p className="text-xs text-[var(--muted)]">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                    {order.delivery_method === 'shipping'
                      ? 'Envío'
                      : order.delivery_method === 'pickup_uruguay'
                        ? 'Retiro Concepción'
                        : 'Retiro en show'}
                  </td>
                  <td className="px-4 py-3 mono text-xs text-[var(--ocre)]">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/pedidos/${order.id}`}
                      className="mono text-[0.65rem] uppercase tracking-[0.13em] text-[var(--ocre)] hover:text-[var(--paper)] transition-colors"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: 'bg-[var(--ocre)]/15 text-[var(--ocre)] border-[var(--ocre)]/40',
    paid: 'bg-[var(--oliva)]/15 text-[var(--oliva)] border-[var(--oliva)]/40',
    shipped: 'bg-[var(--terracota)]/15 text-[var(--terracota)] border-[var(--terracota)]/40',
    delivered: 'bg-[var(--oliva)]/15 text-[var(--oliva)] border-[var(--oliva)]/40',
    cancelled: 'bg-[var(--muted)]/10 text-[var(--muted)] border-[var(--muted)]/30',
  };
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return (
    <span className={`mono text-[0.6rem] uppercase tracking-[0.12em] px-2 py-1 border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
