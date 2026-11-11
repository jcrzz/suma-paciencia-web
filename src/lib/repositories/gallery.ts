import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDemoState, updateDemo } from '@/lib/demo-store';
import type { GalleryItem } from '@/types';

export type GalleryInput = {
  title: string | null;
  category: string;
  image_url: string;
  storage_path: string | null;
  sort_order: number;
  is_published: boolean;
};

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as GalleryItem[];
  }
  return getDemoState()
    .gallery.filter((g) => g.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as GalleryItem[];
  }
  return [...getDemoState().gallery].sort((a, b) => a.sort_order - b.sort_order);
}

export async function createGalleryItem(input: GalleryInput): Promise<GalleryItem> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('gallery').insert(input).select().single();
    if (error) throw error;
    return data as GalleryItem;
  }
  const item: GalleryItem = {
    id: crypto.randomUUID(),
    ...input,
    created_at: new Date().toISOString(),
  };
  updateDemo((draft) => {
    draft.gallery.push(item);
  });
  return item;
}

export async function updateGalleryItem(id: string, input: Partial<GalleryInput>): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('gallery').update(input).eq('id', id);
    if (error) throw error;
    return;
  }
  updateDemo((draft) => {
    const item = draft.gallery.find((g) => g.id === id);
    if (item) Object.assign(item, input);
  });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { data: item } = await supabase.from('gallery').select('storage_path').eq('id', id).single();
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    if (item?.storage_path) {
      await supabase.storage.from('media').remove([item.storage_path]);
    }
    return;
  }
  updateDemo((draft) => {
    draft.gallery = draft.gallery.filter((g) => g.id !== id);
  });
}

/** Sube una imagen a Supabase Storage. En modo demo devuelve un data URL local. */
export async function uploadImage(file: File, folder: string): Promise<{ url: string; path: string }> {
  if (!isSupabaseConfigured) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    });
    return { url: dataUrl, path: `demo/${folder}/${file.name}` };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('media').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function removeFile(path: string | null): Promise<void> {
  if (!path || !isSupabaseConfigured) return;
  await supabase.storage.from('media').remove([path]);
}
