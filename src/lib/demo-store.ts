import type { Show, GalleryItem, EpkInfo, Product, ProductVariant, Order, OrderItem } from '@/types';
import { demoShows, demoGallery, demoEpk, demoProducts, demoVariants } from '@/lib/demo-data';

export type DemoState = {
  shows: Show[];
  gallery: GalleryItem[];
  epk: EpkInfo;
  products: Product[];
  variants: ProductVariant[];
  orders: Order[];
  orderItems: OrderItem[];
};

const STORAGE_KEY = 'sp_demo_state_v3';

function seedState(): DemoState {
  return {
    shows: structuredClone(demoShows),
    gallery: structuredClone(demoGallery),
    epk: structuredClone(demoEpk),
    products: structuredClone(demoProducts),
    variants: structuredClone(demoVariants),
    orders: [],
    orderItems: [],
  };
}

function loadState(): DemoState {
  if (typeof window === 'undefined') return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed.products || !parsed.shows) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

let state: DemoState = loadState();
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded: keep working in memory */
  }
}

export function getDemoState(): DemoState {
  return state;
}

export function subscribeDemo(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateDemo(mutator: (draft: DemoState) => void): DemoState {
  mutator(state);
  persist();
  listeners.forEach((listener) => listener());
  return state;
}

export function resetDemo(): DemoState {
  state = seedState();
  persist();
  listeners.forEach((listener) => listener());
  return state;
}

export function nextOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const used = state.orders.map((o) => o.order_number);
  let seq = state.orders.length + 1;
  let candidate = `SP-${yy}${mm}-${String(seq).padStart(4, '0')}`;
  while (used.includes(candidate)) {
    seq += 1;
    candidate = `SP-${yy}${mm}-${String(seq).padStart(4, '0')}`;
  }
  return candidate;
}
