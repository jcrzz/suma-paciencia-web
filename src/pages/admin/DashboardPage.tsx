import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader, Metric } from '@/components/admin/AdminUI';
import { CalendarDays, PackageX, Receipt } from 'lucide-react';
import { getAllShows } from '@/lib/repositories/shows';
import { listOrders } from '@/lib/repositories/orders';
import { getAllProducts, getVariants } from '@/lib/repositories/products';
import { formatDateTime, formatPrice } from '@/lib/utils';
import type { Order, Product, ProductVariant, Show } from '@/types';

export default function DashboardPage() {
  const [nextShow, setNextShow] = useState<Show | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    getAllShows()
      .then((list) => {
        const now = Date.now();
        const upcoming = list
          .filter((show) => show.is_published)
          .filter((show) => new Date(show.show_date).getTime() >= now)
          .sort((a, b) => a.show_date.localeCompare(b.show_date));
        setNextShow(upcoming[0] ?? null);
      })
      .catch(() => undefined);
    listOrders().then(setOrders).catch(() => undefined);
    getAllProducts().then(setProducts).catch(() => undefined);
    getVariants().then(setVariants).catch(() => undefined);
  }, []);

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const outOfStock = variants.filter((variant) => variant.stock <= 0);
  const lowStock = variants.filter((variant) => variant.stock > 0 && variant.stock <= 3);
  const soldTotal = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <AdminPageHeader
        title="Resumen"
        description="Estado general de la banda: próximas fechas, pedidos de la tienda y stock de merchandising."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="border border-[var(--line-light)] bg-[var(--monte)]/50 p-5">
          <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--muted)] flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" /> Próximo show
          </p>
          {nextShow ? (
            <>
              <p className="display text-2xl font-bold text-[var(--paper)] mt-2">{nextShow.city}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{nextShow.venue}</p>
              <p className="mono text-[0.68rem] text-[var(--ocre)] mt-2">{formatDateTime(nextShow.show_date)}</p>
            </>
          ) : (
            <p className="text-sm text-[var(--muted)] mt-2">No hay fechas cargadas.</p>
          )}
        </div>

        <Metric
          label="Pedidos pendientes"
          value={pendingOrders.length}
          hint={pendingOrders.length ? 'Requieren confirmación' : 'Todo al día'}
          tone={pendingOrders.length ? 'warning' : 'ok'}
        />

        <Metric
          label="Variantes sin stock"
          value={outOfStock.length}
          hint={lowStock.length ? `${lowStock.length} con stock bajo` : 'Stock saludable'}
          tone={outOfStock.length ? 'warning' : 'ok'}
        />

        <Metric label="Vendido" value={formatPrice(soldTotal)} hint={`${orders.length} pedidos registrados`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <section className="border border-[var(--line-light)]">
          <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--line-light)]">
            <h2 className="display font-bold text-[var(--paper)] flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[var(--ocre)]" /> Últimos pedidos
            </h2>
            <Link
              to="/admin/pedidos"
              className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--ocre)] hover:text-[var(--paper)] transition-colors"
            >
              Ver todos
            </Link>
          </header>

          {orders.length === 0 ? (
            <p className="px-5 py-8 text-sm text-[var(--muted)] text-center">
              Todavía no hay pedidos. Cuando alguien compre desde la tienda, va a aparecer acá.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--line-light)]">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[var(--monte)]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="mono text-xs text-[var(--paper)]">{order.order_number}</p>
                      <p className="text-sm text-[var(--muted)] truncate">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="mono text-sm text-[var(--ocre)]">{formatPrice(order.total)}</p>
                      <p className="mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                        {order.status}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-[var(--line-light)]">
          <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--line-light)]">
            <h2 className="display font-bold text-[var(--paper)] flex items-center gap-2">
              <PackageX className="h-4 w-4 text-[var(--ocre)]" /> Alertas de stock
            </h2>
            <Link
              to="/admin/tienda"
              className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--ocre)] hover:text-[var(--paper)] transition-colors"
            >
              Gestionar tienda
            </Link>
          </header>

          {outOfStock.length === 0 && lowStock.length === 0 ? (
            <p className="px-5 py-8 text-sm text-[var(--muted)] text-center">Todo el stock está en orden.</p>
          ) : (
            <ul className="divide-y divide-[var(--line-light)]">
              {[...outOfStock, ...lowStock].map((variant) => {
                const product = products.find((item) => item.id === variant.product_id);
                return (
                  <li key={variant.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--paper)] truncate">{product?.name ?? 'Producto'}</p>
                      <p className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                        Talle {variant.size}
                      </p>
                    </div>
                    <span
                      className={`mono text-[0.65rem] uppercase tracking-[0.12em] ${
                        variant.stock === 0 ? 'text-[var(--terracota)]' : 'text-[var(--ocre)]'
                      }`}
                    >
                      {variant.stock === 0 ? 'Agotado' : `${variant.stock} en stock`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
