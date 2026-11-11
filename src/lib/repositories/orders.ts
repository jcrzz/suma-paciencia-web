import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDemoState, updateDemo, nextOrderNumber } from '@/lib/demo-store';
import type { Order, OrderItem, OrderStatus, DeliveryMethod, PaymentMethod } from '@/types';

export type CreateOrderInput = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_method: DeliveryMethod;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_province?: string | null;
  shipping_postal_code?: string | null;
  notes?: string | null;
  payment_method: PaymentMethod;
  items: { variant_id: string; product_id: string; name: string; size: string; price: number; quantity: number }[];
};

export type CreateOrderResult = {
  order: Order;
  items: OrderItem[];
};

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('place_order', {
      p_customer: {
        customer_name: input.customer_name,
        customer_email: input.customer_email,
        customer_phone: input.customer_phone,
        delivery_method: input.delivery_method,
        shipping_address: input.shipping_address ?? null,
        shipping_city: input.shipping_city ?? null,
        shipping_province: input.shipping_province ?? null,
        shipping_postal_code: input.shipping_postal_code ?? null,
        notes: input.notes ?? null,
        payment_method: input.payment_method,
      },
      p_items: input.items.map((i) => ({
        variant_id: i.variant_id,
        quantity: i.quantity,
      })),
    });
    if (error) throw error;
    const payload = (data ?? {}) as { order_id?: string; order_number?: string; total?: number };
    const orderId = payload.order_id ?? crypto.randomUUID();
    const { data: orderRow } = await supabase.from('orders').select('*').eq('id', orderId).single();
    const { data: itemRows } = await supabase.from('order_items').select('*').eq('order_id', orderId);
    return {
      order: (orderRow as Order) ?? ({ id: orderId, order_number: payload.order_number ?? '', total: payload.total ?? subtotal } as Order),
      items: (itemRows ?? []) as OrderItem[],
    };
  }

  // Demo mode: validate stock, decrement, persist.
  const state = getDemoState();
  for (const item of input.items) {
    const variant = state.variants.find((v) => v.id === item.variant_id);
    if (!variant) throw new Error(`La variante ${item.size} ya no está disponible`);
    if (variant.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${item.name} (talle ${item.size})`);
    }
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    order_number: nextOrderNumber(),
    customer_name: input.customer_name,
    customer_email: input.customer_email,
    customer_phone: input.customer_phone,
    delivery_method: input.delivery_method,
    shipping_address: input.shipping_address ?? null,
    shipping_city: input.shipping_city ?? null,
    shipping_province: input.shipping_province ?? null,
    shipping_postal_code: input.shipping_postal_code ?? null,
    notes: input.notes ?? null,
    subtotal,
    shipping_cost: 0,
    total: subtotal,
    status: 'pending',
    payment_method: input.payment_method,
    created_at: now,
    updated_at: now,
  };

  const items: OrderItem[] = input.items.map((item) => ({
    id: crypto.randomUUID(),
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.name,
    size: item.size,
    unit_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  updateDemo((draft) => {
    draft.orders.unshift(order);
    draft.orderItems.push(...items);
    for (const item of input.items) {
      const variant = draft.variants.find((v) => v.id === item.variant_id);
      if (variant) variant.stock = Math.max(0, variant.stock - item.quantity);
    }
  });

  return { order, items };
}

export async function listOrders(): Promise<Order[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Order[];
  }
  return [...getDemoState().orders].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listOrderItems(): Promise<OrderItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('order_items').select('*');
    if (error) throw error;
    return (data ?? []) as OrderItem[];
  }
  return getDemoState().orderItems;
}

export async function getOrder(id: string): Promise<{ order: Order | null; items: OrderItem[] }> {
  if (isSupabaseConfigured) {
    const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) throw error;
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id);
    return { order: order as Order, items: (items ?? []) as OrderItem[] };
  }
  const state = getDemoState();
  return {
    order: state.orders.find((o) => o.id === id) ?? null,
    items: state.orderItems.filter((i) => i.order_id === id),
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return;
  }
  updateDemo((draft) => {
    const order = draft.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
    }
  });
}
