import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import BankSheet from '@/components/shop/BankSheet';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { createOrder } from '@/lib/repositories/orders';
import { getEpkInfo } from '@/lib/repositories/epk';
import { createMercadoPagoPreference, isMercadoPagoEnabled } from '@/lib/payments/mercadopago';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_LABELS } from '@/lib/whatsapp';
import type { DeliveryMethod, EpkInfo, PaymentMethod } from '@/types';

type FormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_method: DeliveryMethod;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  notes: string;
};

const emptyForm: FormState = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  delivery_method: 'shipping',
  shipping_address: '',
  shipping_city: '',
  shipping_province: '',
  shipping_postal_code: '',
  notes: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { push } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');
  const [submitting, setSubmitting] = useState(false);
  const [epk, setEpk] = useState<EpkInfo | null>(null);

  useEffect(() => {
    getEpkInfo().then(setEpk).catch(() => setEpk(null));
  }, []);

  const deliveryOptions = useMemo(
    () => [
      { value: 'shipping', label: DELIVERY_LABELS.shipping },
      { value: 'pickup_uruguay', label: DELIVERY_LABELS.pickup_uruguay },
      { value: 'pickup_show', label: DELIVERY_LABELS.pickup_show },
    ],
    []
  );

  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.customer_name.trim().length < 2) next.customer_name = 'Escribí tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) next.customer_email = 'Revisá el email.';
    if (form.customer_phone.replace(/\D/g, '').length < 8) next.customer_phone = 'Revisá el número de WhatsApp.';
    if (form.delivery_method === 'shipping') {
      if (form.shipping_address.trim().length < 5) next.shipping_address = 'Necesitamos la calle y el número.';
      if (form.shipping_city.trim().length < 2) next.shipping_city = 'Indicá la ciudad.';
      if (form.shipping_province.trim().length < 2) next.shipping_province = 'Indicá la provincia.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      push('El carrito está vacío', 'error');
      return;
    }
    if (!validate()) {
      push('Revisá los datos del formulario', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { order, items: orderItems } = await createOrder(
        {
          customer_name: form.customer_name.trim(),
          customer_email: form.customer_email.trim(),
          customer_phone: form.customer_phone.trim(),
          delivery_method: form.delivery_method,
          shipping_address: form.delivery_method === 'shipping' ? form.shipping_address.trim() : null,
          shipping_city: form.delivery_method === 'shipping' ? form.shipping_city.trim() : null,
          shipping_province: form.delivery_method === 'shipping' ? form.shipping_province.trim() : null,
          shipping_postal_code: form.delivery_method === 'shipping' ? form.shipping_postal_code.trim() : null,
          notes: form.notes.trim() || null,
          payment_method: paymentMethod,
          items: items.map((item) => ({
            variant_id: item.variantId ?? '',
            product_id: item.productId,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
          })),
        }
      );

      if (paymentMethod === 'mercadopago' && isMercadoPagoEnabled()) {
        try {
          const preference = await createMercadoPagoPreference({
            orderId: order.id,
            orderNumber: order.order_number,
            items: items.map((item) => ({
              title: `${item.name} (${item.size})`,
              unit_price: item.price,
              quantity: item.quantity,
            })),
            payer: {
              name: form.customer_name,
              email: form.customer_email,
              phone: form.customer_phone,
            },
          });
          if (preference) {
            sessionStorage.setItem('sp_last_order', JSON.stringify({ order, items: orderItems }));
            clearCart();
            window.location.href = preference.init_point;
            return;
          }
        } catch {
          push('No pudimos abrir Mercado Pago. Te enviamos el pedido por WhatsApp.', 'error');
        }
      }

      sessionStorage.setItem('sp_last_order', JSON.stringify({ order, items: orderItems }));
      clearCart();
      navigate('/pedido/confirmacion', { state: { orderId: order.id } });
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos crear el pedido', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-[560px] mx-auto px-5 text-center">
        <h1 className="display text-3xl font-bold text-[var(--text-primary)]">Tu pedido está vacío</h1>
        <p className="text-[var(--text-secondary)] mt-3">Elegí algo del merch antes de finalizar la compra.</p>
        <Link
          to="/tienda"
          className="inline-block mt-6 bg-[var(--accent-primary)] text-[var(--text-on-surface)] font-[Fraunces_VF] font-bold px-6 py-3 hover:bg-[var(--accent-secondary)] transition-colors"
        >
          Ver la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Último paso</p>
        <h1 className="display text-[clamp(2.2rem,7vw,4rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] mt-3">
          FINALIZAR COMPRA
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <section className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6">
              <h2 className="display text-xl font-bold text-[var(--text-primary)]">Tus datos</h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre y apellido"
                  value={form.customer_name}
                  onChange={(e) => update('customer_name', e.target.value)}
                  error={errors.customer_name}
                  autoComplete="name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => update('customer_email', e.target.value)}
                  error={errors.customer_email}
                  autoComplete="email"
                  required
                />
                <Input
                  label="WhatsApp"
                  type="tel"
                  placeholder="+54 9 344 000 0000"
                  value={form.customer_phone}
                  onChange={(e) => update('customer_phone', e.target.value)}
                  error={errors.customer_phone}
                  autoComplete="tel"
                  required
                />
              </div>
            </section>

            <section className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6">
              <h2 className="display text-xl font-bold text-[var(--text-primary)]">Entrega</h2>
              <div className="mt-5 space-y-4">
                <Select
                  label="Método de entrega"
                  value={form.delivery_method}
                  onChange={(e) => update('delivery_method', e.target.value)}
                  options={deliveryOptions}
                />

                {form.delivery_method === 'shipping' && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <Input
                        label="Dirección"
                        placeholder="Calle, número, piso/depto"
                        value={form.shipping_address}
                        onChange={(e) => update('shipping_address', e.target.value)}
                        error={errors.shipping_address}
                        autoComplete="street-address"
                      />
                    </div>
                    <Input
                      label="Ciudad"
                      value={form.shipping_city}
                      onChange={(e) => update('shipping_city', e.target.value)}
                      error={errors.shipping_city}
                      autoComplete="address-level2"
                    />
                    <Input
                      label="Provincia"
                      value={form.shipping_province}
                      onChange={(e) => update('shipping_province', e.target.value)}
                      error={errors.shipping_province}
                      autoComplete="address-level1"
                    />
                    <Input
                      label="Código postal"
                      value={form.shipping_postal_code}
                      onChange={(e) => update('shipping_postal_code', e.target.value)}
                      autoComplete="postal-code"
                    />
                  </div>
                )}

                <Textarea
                  label="Notas para la banda (opcional)"
                  placeholder="Ej: retiro en el show de Paraná, o preferís que lo Retire en Concepción."
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </div>
            </section>

            <section className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6">
              <h2 className="display text-xl font-bold text-[var(--text-primary)]">Forma de pago</h2>

              <div className="mt-5 space-y-3">
                <label className="flex items-start gap-3 border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="mt-1 accent-[var(--accent-primary)]"
                  />
                  <span>
                    <span className="block font-[Fraunces_VF] font-bold text-[var(--text-primary)]">
                      Transferencia + WhatsApp
                    </span>
                    <span className="block text-sm text-[var(--text-secondary)] mt-0.5">
                      Transferí al alias y mandanos el comprobante por WhatsApp con el número de pedido.
                    </span>
                  </span>
                </label>

                {isMercadoPagoEnabled() && (
                  <label className="flex items-start gap-3 border border-[var(--border-subtle)] p-4 cursor-pointer hover:border-[var(--border-primary)] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="mercadopago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => setPaymentMethod('mercadopago')}
                      className="mt-1 accent-[var(--accent-primary)]"
                    />
                    <span>
                      <span className="block font-[Fraunces_VF] font-bold text-[var(--text-primary)]">Mercado Pago</span>
                      <span className="block text-sm text-[var(--text-secondary)] mt-0.5">
                        Te redirigimos al checkout de Mercado Pago para pagar con tarjeta o dinero en cuenta.
                      </span>
                    </span>
                  </label>
                )}
              </div>

              {paymentMethod === 'whatsapp' && (
                <div className="mt-5">
                  <BankSheet
                    alias={epk?.transfer_alias}
                    cbu={epk?.transfer_cbu}
                    holder={epk?.transfer_holder}
                    bank={epk?.transfer_bank}
                  />
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] lg:sticky lg:top-24">
              <h2 className="display text-xl font-bold text-[var(--text-primary)] px-5 py-4 border-b border-[var(--border-subtle)]">
                Resumen
              </h2>

              <ul className="divide-y divide-[var(--border-subtle)]">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.size}`} className="px-5 py-4 flex gap-4">
                    <div className="w-14 h-16 shrink-0 border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <p className="font-[Fraunces_VF] font-bold text-sm text-[var(--text-primary)]">{item.name}</p>
                        <p className="mono text-xs text-[var(--accent-primary)]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-secondary)] mt-1">
                        {item.quantity} × talle {item.size}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-5 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">Total</span>
                <span className="display text-2xl font-bold text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
              </div>

              <div className="px-5 pb-5">
                <Button type="submit" full size="lg" disabled={submitting}>
                  {submitting ? 'Generando el pedido…' : 'Confirmar pedido'}
                </Button>
                <p className="flex items-start gap-2 text-xs text-[var(--text-secondary)] mt-4 leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-[var(--status-ok)] shrink-0 mt-0.5" />
                  Guardamos el pedido en nuestro sistema antes del pago. La banda lo confirma por WhatsApp.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
