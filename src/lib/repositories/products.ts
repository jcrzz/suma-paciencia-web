import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDemoState, updateDemo } from '@/lib/demo-store';
import type { Product, ProductVariant } from '@/types';

export type ProductInput = {
  slug: string;
  name: string;
  description: string | null;
  category: Product['category'];
  price: number;
  images: { url: string; path?: string }[];
  is_active: boolean;
  sort_order: number;
};

export type VariantInput = {
  size: string;
  stock: number;
  sku?: string | null;
};

export async function getActiveProducts(): Promise<Product[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  }
  return getDemoState()
    .products.filter((p) => p.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  }
  return [...getDemoState().products].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getVariants(): Promise<ProductVariant[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('product_variants').select('*');
    if (error) throw error;
    return (data ?? []) as ProductVariant[];
  }
  return getDemoState().variants;
}

export async function getVariantsForProduct(productId: string): Promise<ProductVariant[]> {
  const variants = await getVariants();
  return variants.filter((v) => v.product_id === productId);
}

export async function saveProduct(
  input: ProductInput & { id?: string },
  variants: VariantInput[]
): Promise<Product> {
  if (isSupabaseConfigured) {
    let saved: Product;
    if (input.id) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', input.id)
        .select()
        .single();
      if (error) throw error;
      saved = data as Product;
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert({ ...input, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      saved = data as Product;
    }
    await supabase.from('product_variants').delete().eq('product_id', saved.id);
    const rows = variants.map((v) => ({
      id: crypto.randomUUID(),
      product_id: saved.id,
      size: v.size,
      stock: v.stock,
      sku: v.sku ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    if (rows.length) {
      const { error } = await supabase.from('product_variants').insert(rows);
      if (error) throw error;
    }
    return saved;
  }

  const now = new Date().toISOString();
  let saved: Product = { ...(input as Product), id: input.id ?? crypto.randomUUID() };
  updateDemo((draft) => {
    const index = draft.products.findIndex((p) => p.id === saved.id);
    saved = { ...saved, created_at: saved.created_at ?? now, updated_at: now };
    if (index >= 0) draft.products[index] = saved;
    else draft.products.push(saved);
    draft.variants = draft.variants.filter((v) => v.product_id !== saved.id);
    draft.variants.push(
      ...variants.map((v) => ({
        id: crypto.randomUUID(),
        product_id: saved.id,
        size: v.size,
        stock: v.stock,
        sku: v.sku ?? null,
        created_at: now,
        updated_at: now,
      }))
    );
  });
  return saved;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  updateDemo((draft) => {
    draft.products = draft.products.filter((p) => p.id !== id);
    draft.variants = draft.variants.filter((v) => v.product_id !== id);
  });
}
