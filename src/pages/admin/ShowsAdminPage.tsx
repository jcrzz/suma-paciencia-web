import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader, AdminEmptyState } from '@/components/admin/AdminUI';
import Modal from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { createShow, deleteShow, getAllShows, updateShow } from '@/lib/repositories/shows';
import { formatDateTime } from '@/lib/utils';
import type { Show, ShowStatus } from '@/types';

const STATUS_OPTIONS: { value: ShowStatus; label: string }[] = [
  { value: 'available', label: 'Entradas disponibles' },
  { value: 'sold_out', label: 'Agotado' },
  { value: 'free', label: 'Gratis' },
  { value: 'cancelled', label: 'Cancelada' },
];

type FormState = {
  show_date: string;
  city: string;
  venue: string;
  province: string;
  country: string;
  ticket_url: string;
  status: ShowStatus;
  is_published: boolean;
};

const emptyForm: FormState = {
  show_date: '',
  city: '',
  venue: '',
  province: 'Entre Ríos',
  country: 'Argentina',
  ticket_url: '',
  status: 'available',
  is_published: true,
};

function toLocalInput(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function ShowsAdminPage() {
  const { push } = useToast();
  const [shows, setShows] = useState<Show[]>([]);
  const [editing, setEditing] = useState<Show | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = () => {
    getAllShows().then(setShows).catch(() => push('No pudimos cargar las fechas', 'error'));
  };

  useEffect(() => {
    getAllShows().then(setShows).catch(() => push('No pudimos cargar las fechas', 'error'));
  }, [push]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (show: Show) => {
    setEditing(show);
    setForm({
      show_date: toLocalInput(show.show_date),
      city: show.city,
      venue: show.venue,
      province: show.province,
      country: show.country ?? 'Argentina',
      ticket_url: show.ticket_url ?? '',
      status: show.status,
      is_published: show.is_published,
    });
    setErrors({});
    setOpen(true);
  };

  const update = (key: keyof FormState, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.show_date) next.show_date = 'Elegí la fecha.';
    if (form.city.trim().length < 2) next.city = 'Indicá la ciudad.';
    if (form.venue.trim().length < 2) next.venue = 'Indicá el lugar.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      show_date: new Date(form.show_date).toISOString(),
      city: form.city.trim(),
      venue: form.venue.trim(),
      province: form.province.trim(),
      country: form.country.trim(),
      ticket_url: form.ticket_url.trim() || null,
      status: form.status,
      is_published: form.is_published,
    };

    try {
      if (editing) {
        await updateShow(editing.id, payload);
        push('Fecha actualizada', 'success');
      } else {
        await createShow(payload);
        push('Fecha creada', 'success');
      }
      setOpen(false);
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos guardar la fecha', 'error');
    }
  };

  const handleDelete = async (show: Show) => {
    if (!window.confirm(`¿Eliminar la fecha en ${show.city}?`)) return;
    try {
      await deleteShow(show.id);
      push('Fecha eliminada', 'info');
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : 'No pudimos eliminar la fecha', 'error');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Fechas"
        description="Cargá las fechas de la banda, su estado de entradas y el link de la ticketera."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nueva fecha
          </Button>
        }
      />

      {shows.length === 0 ? (
        <AdminEmptyState
          title="Todavía no hay fechas"
          hint="Creá la primera fecha para que aparezca en la agenda pública."
          action={<Button onClick={openCreate}>Crear fecha</Button>}
        />
      ) : (
        <div className="border border-[var(--line-light)] overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-[var(--line-light)] mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                <th className="px-4 py-3 font-normal">Fecha</th>
                <th className="px-4 py-3 font-normal">Ciudad / lugar</th>
                <th className="px-4 py-3 font-normal">Estado</th>
                <th className="px-4 py-3 font-normal">Publicada</th>
                <th className="px-4 py-3 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-light)]">
              {shows.map((show) => (
                <tr key={show.id} className="hover:bg-[var(--monte)]/50 transition-colors">
                  <td className="px-4 py-3 mono text-xs text-[var(--paper)] whitespace-nowrap">
                    {formatDateTime(show.show_date)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[var(--paper)]">{show.city}</p>
                    <p className="text-xs text-[var(--muted)]">{show.venue}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {STATUS_OPTIONS.find((s) => s.value === show.status)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mono text-[0.62rem] uppercase tracking-[0.12em] ${
                        show.is_published ? 'text-[var(--oliva)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      {show.is_published ? 'Sí' : 'Oculta'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(show)}
                        className="p-2 border border-[var(--line-light)] hover:border-[var(--ocre)] hover:text-[var(--ocre)] transition-colors"
                        aria-label="Editar fecha"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(show)}
                        className="p-2 border border-[var(--line-light)] hover:border-[var(--terracota)] hover:text-[var(--terracota)] transition-colors"
                        aria-label="Eliminar fecha"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar fecha' : 'Nueva fecha'}
        size="lg"
      >
        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Fecha y hora"
            type="datetime-local"
            value={form.show_date}
            onChange={(e) => update('show_date', e.target.value)}
            error={errors.show_date}
            required
          />
          <Select
            label="Estado de entradas"
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Input
            label="Ciudad"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            error={errors.city}
            required
          />
          <Input
            label="Lugar"
            value={form.venue}
            onChange={(e) => update('venue', e.target.value)}
            error={errors.venue}
            required
          />
          <Input label="Provincia" value={form.province} onChange={(e) => update('province', e.target.value)} />
          <Input label="País" value={form.country} onChange={(e) => update('country', e.target.value)} />
          <div className="sm:col-span-2">
            <Input
              label="Link de entradas"
              type="url"
              placeholder="https://"
              value={form.ticket_url}
              onChange={(e) => update('ticket_url', e.target.value)}
            />
          </div>

          <label className="sm:col-span-2 flex items-center gap-3 mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => update('is_published', e.target.checked)}
              className="accent-[var(--ocre)]"
            />
            Publicar en el sitio
          </label>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button type="submit">{editing ? 'Guardar cambios' : 'Crear fecha'}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
