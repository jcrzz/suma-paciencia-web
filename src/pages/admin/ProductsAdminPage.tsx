import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import { AdminPageHeader, AdminEmptyState } from '@/components/admin/AdminUI';
import { getAllProducts, getVariants } from '@/lib/repositories/products';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(() => undefined);
    getVariants().then(setVariants).catch(() => undefined);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Tienda"
        description="Productos, fotos y stock por talla. El stock se descuenta cuando el pedido se confirma."
        action={
          <Link
            to="/admin/tienda/nuevo"
            className="inline-flex items-center gap-2 bg-[var(--ocre)] text-[var(--ink)] font-[Fraunces_VF] font-bold px-5 py-2.5 hover:bg-[var(--paper)] transition-colors"
          >
            <Plus className="h-4 w-4" /> Nuevo producto
          </Link>
        }
      />

      {products.length === 0 ? (
        <AdminEmptyState
          title="No hay productos cargados"
          hint="Creá el primer producto para que aparezca en la tienda."
          action={
            <Link
              to="/admin/tienda/nuevo"
              className="inline-block bg-[var(--ocre)] text-[var(--ink)] font-[Fraunces_VF] font-bold px-5 py-2.5"
            >
              Crear producto
            </Link>
          }
        />
      ) : (
        <div className="border border-[var(--line-light)] overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[var(--line-light)] mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                <th className="px-4 py-3 font-normal">Producto</th>
                <th className="px-4 py-3 font-normal">Categoría</th>
                <th className="px-4 py-3 font-normal">Precio</th>
                <th className="px-4 py-3 font-normal">Stock</th>
                <th className="px-4 py-3 font-normal">Estado</th>
                <th className="px-4 py-3 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-light)]">
              {products.map((product) => {
                const list = variants.filter((v) => v.product_id === product.id);
                const totalStock = list.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={product.id} className="hover:bg-[var(--monte)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0]?.url && (
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="w-10 h-12 object-cover border border-[var(--line-light)]"
                          />
                        )}
                        <div>
                          <p className="text-sm text-[var(--paper)]">{product.name}</p>
                          <p className="mono text-[0.6rem] text-[var(--muted)]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--paper)]">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 mono text-xs">
                      <span className={totalStock === 0 ? 'text-[var(--terracota)]' : 'text-[var(--paper)]'}>
                        {totalStock}
                      </span>
                      <span className="text-[var(--muted)] text-[0.65rem] ml-1">
                        ({list.length} {list.length === 1 ? 'talla' : 'talles'})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`mono text-[0.62rem] uppercase tracking-[0.12em] ${
                          product.is_active ? 'text-[var(--oliva)]' : 'text-[var(--muted)]'
                        }`}
                      >
                        {product.is_active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Link
                          to={`/admin/tienda/${product.id}`}
                          className="p-2 border border-[var(--line-light)] hover:border-[var(--ocre)] hover:text-[var(--ocre)] transition-colors"
                          aria-label="Editar producto"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
