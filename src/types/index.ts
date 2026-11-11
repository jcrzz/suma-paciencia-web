export type ShowStatus = 'available' | 'sold_out' | 'free' | 'cancelled';
export type ProductCategory = 'indumentaria' | 'discos' | 'accesorios';
export type DeliveryMethod = 'shipping' | 'pickup_uruguay' | 'pickup_show';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'whatsapp' | 'mercadopago';

export type Show = {
  id: string;
  show_date: string;
  city: string;
  venue: string;
  province: string;
  country?: string;
  ticket_url: string | null;
  status: ShowStatus;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
  storage_path: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type Member = { name: string; instrument: string; };
export type EpkInfo = {
  id: number;
  bio: string;
  short_bio: string | null;
  members: Member[];
  press_quotes: { source: string; quote: string; link?: string }[];
  press_photo_url: string | null;
  press_kit_url: string | null;
  rider_url: string | null;
  booking_name: string | null;
  booking_email: string | null;
  booking_phone: string | null;
  press_name: string | null;
  press_email: string | null;
  press_phone: string | null;
  transfer_alias: string | null;
  transfer_cbu: string | null;
  transfer_holder: string | null;
  transfer_bank: string | null;
  instagram_url: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number;
  images: { url: string; path?: string }[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  sku: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_method: DeliveryMethod;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_province: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  size: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type CartItem = {
  productId: string;
  variantId: string | null;
  size: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
};

export type Track = {
  number: number;
  title: string;
  duration: string;
  lyrics: string | null;
};

export type Album = {
  id: string;
  title: string;
  year: number | null;
  label: string | null;
  category: 'album' | 'ep' | 'single';
  cover: string;
  spotify: string | null;
  youtube: string | null;
  tracks: Track[];
};

export type ContactInfo = {
  whatsapp?: string;
  booking_email?: string;
  press_email?: string;
  alias?: string;
};