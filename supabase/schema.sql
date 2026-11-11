-- =====================================================================
--  SUMA PACIENCIA · Esquema de base de datos (Supabase / PostgreSQL)
--  Ejecutar en el SQL Editor de Supabase (o `supabase db push`).
--  Orden: 1) este archivo  2) crear el usuario admin en Authentication
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Helper: updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- SHOWS · fechas de la banda
-- ---------------------------------------------------------------------
create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  show_date timestamptz not null,
  city text not null,
  venue text not null,
  province text not null default 'Entre Ríos',
  country text not null default 'Argentina',
  ticket_url text,
  status text not null default 'available'
    check (status in ('available', 'sold_out', 'free', 'cancelled')),
  is_published boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shows_show_date_idx on public.shows (show_date);
create index if not exists shows_published_idx on public.shows (is_published);

drop trigger if exists shows_set_updated_at on public.shows;
create trigger shows_set_updated_at
before update on public.shows
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- GALLERY · fotos y videos
-- ---------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text not null default 'vivo'
    check (category in ('vivo', 'ensayo', 'backstage', 'prensa', 'estudio')),
  image_url text not null,
  storage_path text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_sort_order_idx on public.gallery (sort_order);

-- ---------------------------------------------------------------------
-- EPK_INFO · una única fila con la info de prensa, contacto y cobros
-- ---------------------------------------------------------------------
create table if not exists public.epk_info (
  id smallint primary key default 1 check (id = 1),
  bio text not null default '',
  short_bio text,
  members jsonb not null default '[]'::jsonb,
  press_quotes jsonb not null default '[]'::jsonb,
  press_photo_url text,
  press_kit_url text,
  rider_url text,
  booking_name text,
  booking_email text,
  booking_phone text,
  press_name text,
  press_email text,
  press_phone text,
  transfer_alias text,
  transfer_cbu text,
  transfer_holder text,
  transfer_bank text,
  instagram_url text,
  spotify_url text,
  youtube_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists epk_info_set_updated_at on public.epk_info;
create trigger epk_info_set_updated_at
before update on public.epk_info
for each row execute function public.set_updated_at();

insert into public.epk_info (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- PRODUCTS · merchandising
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null default 'accesorios'
    check (category in ('indumentaria', 'discos', 'accesorios')),
  price numeric(12, 2) not null check (price >= 0),
  images jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (is_active);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- PRODUCT_VARIANTS · talles y stock
-- ---------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  sku text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size)
);

create index if not exists product_variants_product_idx on public.product_variants (product_id);

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- ORDERS · pedidos de la tienda
-- ---------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique
    default ('SP-' || to_char(now(), 'YYMM') || '-' || lpad(nextval('public.order_number_seq')::text, 4, '0')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_method text not null default 'shipping'
    check (delivery_method in ('shipping', 'pickup_uruguay', 'pickup_show')),
  shipping_address text,
  shipping_city text,
  shipping_province text,
  shipping_postal_code text,
  notes text,
  subtotal numeric(12, 2) not null default 0,
  shipping_cost numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null default 'whatsapp'
    check (payment_method in ('whatsapp', 'mercadopago')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- ORDER_ITEMS · detalle del pedido
-- ---------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  size text,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- =====================================================================
--  Row Level Security
-- =====================================================================
alter table public.shows enable row level security;
alter table public.gallery enable row level security;
alter table public.epk_info enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- SHOWS: lectura pública de las publicadas, escritura del equipo
drop policy if exists "Public read published shows" on public.shows;
create policy "Public read published shows"
on public.shows for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated manage shows" on public.shows;
create policy "Authenticated manage shows"
on public.shows for all
to authenticated
using (true)
with check (true);

-- GALLERY
drop policy if exists "Public read published gallery" on public.gallery;
create policy "Public read published gallery"
on public.gallery for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated manage gallery" on public.gallery;
create policy "Authenticated manage gallery"
on public.gallery for all
to authenticated
using (true)
with check (true);

-- EPK_INFO
drop policy if exists "Public read epk" on public.epk_info;
create policy "Public read epk"
on public.epk_info for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated manage epk" on public.epk_info;
create policy "Authenticated manage epk"
on public.epk_info for all
to authenticated
using (true)
with check (true);

-- PRODUCTS
drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
on public.products for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated manage products" on public.products;
create policy "Authenticated manage products"
on public.products for all
to authenticated
using (true)
with check (true);

-- PRODUCT_VARIANTS
drop policy if exists "Public read variants of active products" on public.product_variants;
create policy "Public read variants of active products"
on public.product_variants for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_variants.product_id and p.is_active = true
  )
);

drop policy if exists "Authenticated manage variants" on public.product_variants;
create policy "Authenticated manage variants"
on public.product_variants for all
to authenticated
using (true)
with check (true);

-- ORDERS: sin lectura pública (datos personales). El público crea pedidos
-- mediante la función place_order (security definer).
drop policy if exists "Authenticated read orders" on public.orders;
create policy "Authenticated read orders"
on public.orders for select
to authenticated
using (true);

drop policy if exists "Authenticated update orders" on public.orders;
create policy "Authenticated update orders"
on public.orders for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated delete orders" on public.orders;
create policy "Authenticated delete orders"
on public.orders for delete
to authenticated
using (true);

-- ORDER_ITEMS
drop policy if exists "Authenticated read order items" on public.order_items;
create policy "Authenticated read order items"
on public.order_items for select
to authenticated
using (true);

drop policy if exists "Authenticated manage order items" on public.order_items;
create policy "Authenticated manage order items"
on public.order_items for all
to authenticated
using (true)
with check (true);

-- =====================================================================
--  place_order · creación atómica de pedidos (valida stock y descuenta)
-- =====================================================================
create or replace function public.place_order(
  p_customer jsonb,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12, 2) := 0;
  v_item jsonb;
  v_variant_id uuid;
  v_quantity integer;
  v_stock integer;
  v_size text;
  v_product_name text;
  v_price numeric(12, 2);
  v_is_active boolean;
  v_line_total numeric(12, 2);
begin
  if p_customer is null or p_items is null then
    raise exception 'INVALID_PAYLOAD';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  if coalesce(trim(p_customer->>'customer_name'), '') = '' then
    raise exception 'INVALID_NAME';
  end if;

  if coalesce(trim(p_customer->>'customer_email'), '') = '' then
    raise exception 'INVALID_EMAIL';
  end if;

  if coalesce(trim(p_customer->>'customer_phone'), '') = '' then
    raise exception 'INVALID_PHONE';
  end if;

  insert into public.orders (
    customer_name,
    customer_email,
    customer_phone,
    delivery_method,
    shipping_address,
    shipping_city,
    shipping_province,
    shipping_postal_code,
    notes,
    payment_method,
    status
  ) values (
    trim(p_customer->>'customer_name'),
    trim(p_customer->>'customer_email'),
    trim(p_customer->>'customer_phone'),
    coalesce(p_customer->>'delivery_method', 'shipping'),
    nullif(trim(coalesce(p_customer->>'shipping_address', '')), ''),
    nullif(trim(coalesce(p_customer->>'shipping_city', '')), ''),
    nullif(trim(coalesce(p_customer->>'shipping_province', '')), ''),
    nullif(trim(coalesce(p_customer->>'shipping_postal_code', '')), ''),
    nullif(trim(coalesce(p_customer->>'notes', '')), ''),
    coalesce(p_customer->>'payment_method', 'whatsapp'),
    'pending'
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_quantity := coalesce((v_item->>'quantity')::int, 0);

    if v_quantity <= 0 then
      raise exception 'INVALID_QUANTITY';
    end if;

    select pv.stock, pv.size, p.name, p.price, p.is_active
      into v_stock, v_size, v_product_name, v_price, v_is_active
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
      where pv.id = v_variant_id
      for update of pv;

    if not found then
      raise exception 'VARIANT_NOT_FOUND';
    end if;

    if not v_is_active then
      raise exception 'PRODUCT_INACTIVE';
    end if;

    if v_stock < v_quantity then
      raise exception 'INSUFFICIENT_STOCK:%', v_product_name;
    end if;

    v_line_total := round(v_price * v_quantity, 2);

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, size, unit_price, quantity, subtotal
    ) values (
      v_order_id,
      (select product_id from public.product_variants where id = v_variant_id),
      v_variant_id,
      v_product_name,
      v_size,
      v_price,
      v_quantity,
      v_line_total
    );

    update public.product_variants
    set stock = stock - v_quantity, updated_at = now()
    where id = v_variant_id;

    v_subtotal := v_subtotal + v_line_total;
  end loop;

  update public.orders
  set subtotal = v_subtotal, total = v_subtotal + shipping_cost, updated_at = now()
  where id = v_order_id;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'total', v_subtotal
  );
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;

-- =====================================================================
--  Storage · bucket público "media" para fotos, riders y press kits
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "Authenticated upload media" on storage.objects;
create policy "Authenticated upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media');

drop policy if exists "Authenticated update media" on storage.objects;
create policy "Authenticated update media"
on storage.objects for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

drop policy if exists "Authenticated delete media" on storage.objects;
create policy "Authenticated delete media"
on storage.objects for delete
to authenticated
using (bucket_id = 'media');

-- =====================================================================
--  FIN
-- =====================================================================
