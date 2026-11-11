import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { deleteProduct, getAllProducts, getVariantsForProduct, saveProduct } from '@/lib/repositories/products';
import { uploadImage } from '@/lib/repositories/gallery';
import { slugify } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';

type VariantDraft = { size: string; stock: number };

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'indumentaria', label: 'Indumentaria' },
  { value: 'discos', label: 'Discos / físico' },
  { value: 'accesorios', label: 'Accesorios' },
];

const COMMON_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Único'];

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const imageRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('indumentaria');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<{ url: string; path?: string }[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<VariantDraft[]>([{ size: 'Único', stock: 0 }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAllProducts().then(async (products) => {
      const found = products.find((p) => p.id === id);
      if (!found) {
        push('No encontramos el producto', 'error');
        navigate('/admin/tienda');
        return;
      }
      setProduct(found);
      setName(found.name);
      setSlug(found.slug);
      setSlugTouched(true);
      setDescription(found.description ?? '');
      setCategory(found.category);
      setPrice(String(found.price));
      setImages(found.images);
      setIsActive(found.is_active);
      const list = await getVariantsForProduct(found.id);
      setVariants(list.length ? list.map((v) => ({ size: v.size, stock: v.stock })) : [{ size: 'Único', stock: 0 }]);
    });
  }, [id, navigate, push]);

  const handleName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    try {
      const uploaded: { url: string; path?: string }[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadImage(file, 'products');
        uploaded.push({ url: result.url, path: result.path });
      }
      setImages((current) => [...current, ...uploaded]);
      push('Fotos cargadas. Guardá para aplicar.', 'success');
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos subir las fotos', 'error');
    } finally {
      if (imageRef.current) imageRef.current.value = '';
    }
  };

  const addVariant = () => {
    const used = variants.map((v) => v.size);
    const next = COMMON_SIZES.find((size) => !used.includes(size)) ?? 'Único';
    setVariants((current) => [...current, { size: next, stock: 0 }]);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Escribí el nombre del producto.';
    if (!slug.trim()) next.slug = 'Necesitamos un slug.';
    if (!price || Number(price) <= 0) next.price = 'Indicá un precio mayor a 0.';
    const sizes = variants.map((v) => v.size.trim().toLowerCase());
    if (sizes.some((s) => s.length === 0)) next.variants = 'Todas las talles necesitan un nombre.';
    if (new Set(sizes).size !== sizes.length) next.variants = 'No puede haber talles repetidas.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await saveProduct(
        {
          id: product?.id,
          name: name.trim(),
          slug: slugify(slug.trim()),
          description: description.trim() || null,
          category,
          price: Number(price),
          images,
          is_active: isActive,
          sort_order: product?.sort_order ?? 0,
        },
        variants.map((v) => ({ size: v.size.trim(), stock: Math.max(0, Number(v.stock) || 0) }))
      );
      push('Producto guardado', 'success');
      navigate('/admin/tienda');
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos guardar el producto', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!window.confirm(`¿Eliminar “${product.name}”? Los pedidos ya realizados se conservan.`)) return;
    await deleteProduct(product.id);
    push('Producto eliminado', 'info');
    navigate('/admin/tienda');
  };

  return (
    <form onSubmit={handleSave}>
      <AdminPageHeader
        title={product ? 'Editar producto' : 'Nuevo producto'}
        description="Datos del producto, fotos y stock por talla."
        action={
          <div className="flex gap-3">
            <Link
              to="/admin/tienda"
              className="inline-flex items-center gap-2 border border-[var(--line-light)] px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar producto'}
            </Button>
          </div>
        }
      />

      <div className="grid xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-6">
          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5 space-y-4">
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => handleName(e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Slug (URL)"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              error={errors.slug}
              hint={slug ? `/tienda/${slug}` : undefined}
            />
            <Textarea
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Categoría"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                options={CATEGORY_OPTIONS}
              />
              <Input
                label="Precio (ARS)"
                type="number"
                min="0"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={errors.price}
                required
              />
            </div>
            <label className="flex items-center gap-3 mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[var(--ocre)]"
              />
              Visible en la tienda
            </label>
          </section>

          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="display text-lg font-bold text-[var(--paper)]">Fotos</h2>
              <Button type="button" variant="outline" size="sm" onClick={() => imageRef.current?.click()}>
                <ImagePlus className="h-3.5 w-3.5" /> Agregar
              </Button>
            </div>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            {images.length === 0 ? (
              <p className="text-sm text-[var(--muted)] text-center py-6 border border-dashed border-[var(--line-light)]">
                Sin fotos todavía.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div key={`${image.url}-${index}`} className="relative border border-[var(--line-light)]">
                    <img src={image.url} alt="" className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 p-1.5 bg-[var(--ink)]/85 text-[var(--paper)] hover:text-[var(--terracota)] transition-colors"
                      aria-label="Quitar foto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="xl:col-span-5">
          <section className="border border-[var(--line-light)] bg-[var(--monte)]/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="display text-lg font-bold text-[var(--paper)]">Talles y stock</h2>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                Agregar talla
              </Button>
            </div>

            {errors.variants && <p className="text-xs text-[var(--terracota)] mb-3">{errors.variants}</p>}

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="w-32">
                    <Input
                      label="Talle"
                      value={variant.size}
                      onChange={(e) =>
                        setVariants((current) =>
                          current.map((v, i) => (i === index ? { ...v, size: e.target.value } : v))
                        )
                      }
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      label="Stock"
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) =>
                        setVariants((current) =>
                          current.map((v, i) => (i === index ? { ...v, stock: Number(e.target.value) } : v))
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setVariants((current) => current.filter((_, i) => i !== index))}
                    className="mb-1 p-2 border border-[var(--line-light)] hover:border-[var(--terracota)] hover:text-[var(--terracota)] transition-colors"
                    aria-label="Quitar talla"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {product && (
              <div className="mt-6 pt-5 border-t border-[var(--line-light)]">
                <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar producto
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </form>
  );
}
