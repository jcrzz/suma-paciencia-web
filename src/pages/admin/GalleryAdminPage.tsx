import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { AdminPageHeader, AdminEmptyState } from '@/components/admin/AdminUI';
import { Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import {
  createGalleryItem,
  deleteGalleryItem,
  getAllGallery,
  updateGalleryItem,
  uploadImage,
} from '@/lib/repositories/gallery';
import type { GalleryItem } from '@/types';

const CATEGORIES = ['vivo', 'ensayo', 'backstage', 'prensa', 'estudio'];

export default function GalleryAdminPage() {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState('vivo');
  const [uploading, setUploading] = useState(false);

  const load = () => {
    getAllGallery().then(setItems).catch(() => push('No pudimos cargar la galería', 'error'));
  };

  useEffect(() => {
    getAllGallery().then(setItems).catch(() => push('No pudimos cargar la galería', 'error'));
  }, [push]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const { url, path } = await uploadImage(file, 'gallery');
        await createGalleryItem({
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          category,
          image_url: url,
          storage_path: path,
          sort_order: items.length,
          is_published: true,
        });
      }
      push('Imágenes subidas', 'success');
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos subir las imágenes', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const togglePublished = async (item: GalleryItem) => {
    await updateGalleryItem(item.id, { is_published: !item.is_published });
    load();
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm(`¿Eliminar “${item.title ?? 'imagen'}” de la galería?`)) return;
    try {
      await deleteGalleryItem(item.id);
      push('Imagen eliminada', 'info');
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos eliminar la imagen', 'error');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Galería"
        description="Subí fotos de shows, ensayos y backstage. Las imágenes reemplazables quedan disponibles para el sitio público."
        action={
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <ImagePlus className="h-4 w-4" /> {uploading ? 'Subiendo…' : 'Subir imágenes'}
          </Button>
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-wrap items-end gap-4 mb-8 max-w-sm">
        <div className="w-full">
          <Select
            label="Categoría para las próximas cargas"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState
          title="La galería está vacía"
          hint="Subí las primeras imágenes para que aparezcan en /galeria."
          action={<Button onClick={() => fileRef.current?.click()}>Subir imágenes</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <figure key={item.id} className="border border-[var(--line-light)] bg-[var(--monte)]/50">
              <img src={item.image_url} alt={item.title ?? ''} className="w-full h-48 object-cover" />
              <figcaption className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-[var(--paper)] truncate">{item.title ?? 'Sin título'}</p>
                  <p className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)] mt-1">
                    {item.category} · {item.is_published ? 'publicada' : 'oculta'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(item)}
                    className="mono text-[0.6rem] uppercase tracking-[0.1em] border border-[var(--line-light)] px-2 py-1.5 hover:border-[var(--ocre)] hover:text-[var(--ocre)] transition-colors"
                  >
                    {item.is_published ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 border border-[var(--line-light)] hover:border-[var(--terracota)] hover:text-[var(--terracota)] transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
